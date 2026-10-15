'use client';

import { formatRupees } from '@/domain/format';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { ApiError, clientApi } from '@/lib/api';
import { defaultCounts, toQuoteRequest, travellerTotals } from '@/lib/bookingSelection';
import { firstOpenDate } from '@/lib/dates';
import { BookingSteps } from './BookingSteps';
import { BookingSummary } from './BookingSummary';
import { PaymentStep } from './PaymentStep';
import { TravellersStep } from './TravellersStep';
import { TripStep } from './TripStep';
import { useQuote } from './useQuote';
import { useRazorpayCheckout } from './useRazorpayCheckout';
import { validateTravellerDetails } from './validateBooking';

const TRIP_STEP = 1;
const TRAVELLERS_STEP = 2;
const PAYMENT_STEP = 3;

/** API field errors that belong to step 1; everything about people belongs to step 2. */
const TRIP_FIELDS = ['priceId', 'departureId', 'travelDate', 'counts', 'pickupPoint', 'couponCode'];

const confirmationHref = (bookingNumber) => `/booking/confirmed?booking=${encodeURIComponent(bookingNumber)}`;

/** The package page's choice from the URL, checked against what the package offers now. */
function initialTrip(pkg, selection) {
  const price =
    pkg.prices.find((p) => p.id === selection.priceId) ??
    pkg.prices.find((p) => p.isDefault) ??
    pkg.prices[0];
  const hasCounts = Object.values(selection.counts).some(Boolean);
  const openDepartures = pkg.departures.filter((d) => !d.soldOut);
  const departure = openDepartures.find((d) => d.id === selection.departureId) ?? openDepartures[0];
  return {
    priceId: price?.id ?? null,
    counts: hasCounts && price?.id === selection.priceId ? selection.counts : defaultCounts(price?.priceType),
    departureId: departure?.id ?? null,
    travelDate: selection.travelDate ?? firstOpenDate(pkg.pricing.earliestTravelDate, pkg.blockedDates),
    pickupPoint: '',
    couponCode: selection.couponCode,
  };
}

const blankTraveller = (fullName = '') => ({ fullName, age: '', gender: '' });

/** Groups "travellers.0.age"-style API errors by the step that shows them. */
function stepForFields(fields) {
  const keys = Object.keys(fields);
  if (keys.some((key) => TRIP_FIELDS.some((field) => key === field || key.startsWith(`${field}.`))))
    return TRIP_STEP;
  if (keys.length) return TRAVELLERS_STEP;
  return null;
}

/** /booking: three steps, summary with live quote, Razorpay payment (design/Booking.dc.html). */
export function BookingFlow({ pkg, selection, customer, booking, companyName }) {
  const router = useRouter();
  const openCheckout = useRazorpayCheckout();
  const fixed = pkg.availabilityType === 'fixed_date';

  const [step, setStep] = useState(TRIP_STEP);
  const [trip, setTripState] = useState(() => initialTrip(pkg, selection));
  const [details, setDetailsState] = useState(() => ({
    travellers: [blankTraveller(customer.name ?? '')],
    leadPhone: customer.phone ?? '',
    specialRequests: '',
    method: 'upi',
    acceptTerms: false,
  }));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  // Razorpay reported success: we are verifying and moving on to the confirmation page.
  const [paid, setPaid] = useState(false);
  // Set once POST /bookings succeeds: seats are held and the price is fixed; "Pay" retries it.
  const [created, setCreated] = useState(null);

  const price = pkg.prices.find((p) => p.id === trip.priceId);
  const totals = price ? travellerTotals(price, trip.counts) : { seats: 0, infants: 0 };
  // One form per person; rows kept beyond the current count come back if the count goes up again.
  const travellers = Array.from(
    { length: totals.seats + totals.infants },
    (_, i) => details.travellers[i] ?? blankTraveller(),
  );

  const request = useMemo(
    () =>
      price && (fixed ? trip.departureId : trip.travelDate)
        ? toQuoteRequest({
            packageId: pkg.id,
            priceId: trip.priceId,
            counts: trip.counts,
            couponCode: trip.couponCode,
            ...(fixed ? { departureId: trip.departureId } : { travelDate: trip.travelDate }),
          })
        : null,
    [price, fixed, pkg.id, trip],
  );
  const quoteState = useQuote(request);
  const { quote, fieldErrors: quoteErrors } = quoteState;

  const setTrip = (patch) => {
    setTripState((current) => {
      const next = { ...current, ...patch };
      if (patch.priceId && patch.priceId !== current.priceId) {
        next.counts = defaultCounts(pkg.prices.find((p) => p.id === patch.priceId)?.priceType);
      }
      return next;
    });
    setErrors({});
  };
  const setDetails = (patch) => {
    setDetailsState((current) => ({ ...current, ...patch }));
    setErrors({});
  };

  const tripErrors = {
    date: errors.departureId ?? errors.travelDate ?? quoteErrors.departureId ?? quoteErrors.travelDate,
    counts:
      errors.counts ?? quoteErrors['counts.adults'] ?? quoteErrors['counts.units'] ?? quoteErrors.counts,
    pickupPoint: errors.pickupPoint,
  };

  function goForward() {
    setMessage(null);
    if (step === TRIP_STEP) {
      if (!trip.pickupPoint.trim()) return setErrors({ pickupPoint: 'Choose a pickup point.' });
      if (!quote || quoteState.loading) {
        return setMessage(quoteState.error ?? 'Please wait while we calculate your price.');
      }
    }
    if (step === TRAVELLERS_STEP) {
      const problems = validateTravellerDetails({ travellers, leadPhone: details.leadPhone });
      if (Object.keys(problems).length) return setErrors(problems);
    }
    setStep((current) => current + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function createBooking() {
    try {
      const { data } = await clientApi.post('/bookings', {
        ...request,
        pickupPoint: trip.pickupPoint.trim(),
        leadName: travellers[0].fullName.trim(),
        leadPhone: details.leadPhone.trim(),
        specialRequests: details.specialRequests.trim() || undefined,
        travellers: travellers.map((t) => ({
          fullName: t.fullName.trim(),
          age: Number(t.age),
          gender: t.gender,
        })),
        acceptTerms: details.acceptTerms,
      });
      setCreated(data);
      // Ready the confirmation page while the customer pays, so the switch after payment is instant.
      router.prefetch(confirmationHref(data.bookingNumber));
      return data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return null;
      }
      const fields = error instanceof ApiError ? error.fields : {};
      const target = stepForFields(fields);
      if (fields.acceptTerms) setErrors(fields);
      else if (target) {
        setErrors(fields);
        setStep(target);
      }
      setMessage(error.message);
      return null;
    }
  }

  async function pay() {
    setMessage(null);
    if (!details.acceptTerms) return setErrors({ acceptTerms: 'Please accept the booking terms.' });
    setBusy(true);
    const booked = created ?? (await createBooking());
    if (!booked) return setBusy(false);

    try {
      await openCheckout(booked.checkout, {
        companyName,
        method: details.method,
        onSuccess: async (payment) => {
          setPaid(true);
          try {
            await clientApi.post('/payments/verify', payment);
          } catch (error) {
            // A rejected signature is a real problem; anything else (network) is confirmed by the webhook.
            if (error instanceof ApiError && error.status === 400) {
              setPaid(false);
              setBusy(false);
              return setMessage(error.message);
            }
          }
          router.push(confirmationHref(booked.bookingNumber));
        },
        onFailure: (reason) => {
          setBusy(false);
          setMessage(
            `Payment failed${reason ? `: ${reason}` : ''}. Your seats are held for 30 minutes — press Pay to try again.`,
          );
        },
        onDismiss: () => {
          setBusy(false);
          setMessage(
            'Payment was not completed. Your seats are held for 30 minutes — press Pay to try again.',
          );
        },
      });
    } catch (error) {
      setBusy(false);
      setMessage(error.message);
    }
  }

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 pt-5 pb-10 lg:gap-7 lg:px-20 lg:pt-10 lg:pb-20">
      <div className="flex flex-col gap-2">
        <Link href={`/packages/${pkg.slug}`} className="text-sm text-muted hover:underline">
          ← Back to {pkg.title}
        </Link>
        <h1 className="text-[22px] font-extrabold tracking-[-0.6px] lg:text-[32px] lg:tracking-[-1px]">
          Complete your booking
        </h1>
      </div>

      <BookingSteps step={step} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-10">
        <div className="order-2 flex min-w-0 flex-1 flex-col gap-5 rounded-[14px] border border-line bg-surface p-5 lg:order-1 lg:gap-[22px] lg:rounded-[var(--radius-panel)] lg:p-8">
          {step === TRIP_STEP && (
            <TripStep
              pkg={pkg}
              trip={trip}
              setTrip={setTrip}
              pickupPoints={booking.pickupPoints}
              errors={tripErrors}
            />
          )}
          {step === TRAVELLERS_STEP && (
            <TravellersStep
              details={{ ...details, travellers }}
              setDetails={setDetails}
              seats={totals.seats}
              email={customer.email}
              errors={errors}
            />
          )}
          {step === PAYMENT_STEP && (
            <PaymentStep
              details={details}
              setDetails={setDetails}
              termsText={booking.termsText}
              errors={errors}
            />
          )}

          {paid ? (
            <FormMessage tone="success">Payment received. Confirming your booking…</FormMessage>
          ) : (
            message && <FormMessage>{message}</FormMessage>
          )}

          <div className="flex justify-between gap-2.5 border-t border-line pt-4 lg:pt-[18px]">
            <Button
              variant="outline"
              onClick={() => {
                setMessage(null);
                setStep((current) => current - 1);
              }}
              className={step === TRIP_STEP || created ? 'invisible' : ''}
            >
              Back
            </Button>
            {step === PAYMENT_STEP ? (
              <Button variant="accent" size="lg" onClick={pay} disabled={busy || !quote}>
                {paid
                  ? 'Confirming…'
                  : busy
                    ? 'Opening payment…'
                    : `Pay ${formatRupees(created?.checkout.amount ?? quote?.payNow ?? 0)}`}
              </Button>
            ) : (
              <Button size="lg" onClick={goForward}>
                Continue
              </Button>
            )}
          </div>
        </div>

        {/* Stretched to the row height so the summary can stay sticky while the form scrolls. */}
        <div className="order-1 lg:order-2 lg:self-stretch">
          <BookingSummary
            pkg={pkg}
            price={price}
            quote={quote}
            quoteState={quoteState}
            couponCode={trip.couponCode}
            onCoupon={(couponCode) => setTrip({ couponCode })}
            couponLocked={Boolean(created)}
            cancellationNote={booking.freeCancellationNote}
          />
        </div>
      </div>
    </div>
  );
}
