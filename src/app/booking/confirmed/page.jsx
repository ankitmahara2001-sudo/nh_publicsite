import { formatDateRange, formatRupees } from '@/domain/format';
import { notFound } from 'next/navigation';
import { travellerSummary } from '@/components/account/travellerCount';
import { RefreshWhilePending } from '@/components/booking/RefreshWhilePending';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { requireCustomerPage } from '@/lib/account';
import { ApiError } from '@/lib/api';
import { getAsCustomer, getSiteSettings } from '@/lib/server';

export const metadata = {
  title: 'Booking confirmed',
  robots: { index: false, follow: false },
};

const BOOKING_NUMBER = /^NH-\d{4}-\d{5,}$/;
const pad = (n) => String(n).padStart(2, '0');

async function loadBooking(bookingNumber) {
  try {
    return (await getAsCustomer(`/me/bookings/${encodeURIComponent(bookingNumber)}`)).data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }
}

/** Heading and text for each state the booking can be in when the customer lands here. */
function headline(booking) {
  if (booking.status === 'confirmed' || booking.status === 'completed') {
    return {
      title: 'Your journey is confirmed!',
      text: `We have sent the booking details to ${booking.leadEmail}. Your trip coordinator will be in touch before departure.`,
      icon: 'check',
    };
  }
  if (booking.status === 'cancelled') {
    return {
      title: 'This booking was cancelled',
      text: 'The payment was not completed in time, so the seats were released. Please book again, or contact us if money was taken from your account.',
      icon: 'cross',
    };
  }
  return {
    title: 'We are confirming your payment',
    text: 'This usually takes a few seconds. You will also get a confirmation email once it is done.',
    icon: 'clock',
  };
}

const ICON_PATHS = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  cross: 'M7 7l10 10M17 7L7 17',
  clock: 'M12 7v5l3 2',
};

/** /booking/confirmed?booking=NH-… (design/Confirmation.dc.html). */
export default async function BookingConfirmedPage({ searchParams }) {
  const { booking: bookingNumber } = await searchParams;
  if (typeof bookingNumber !== 'string' || !BOOKING_NUMBER.test(bookingNumber)) notFound();
  await requireCustomerPage(`/booking/confirmed?booking=${encodeURIComponent(bookingNumber)}`);
  const [booking, settings] = await Promise.all([loadBooking(bookingNumber), getSiteSettings()]);

  const { title, text, icon } = headline(booking);
  const confirmed = icon === 'check';
  const details = [
    { label: 'Package', value: booking.packageTitle },
    { label: 'Dates', value: formatDateRange(booking.travelDate, booking.endDate) },
    { label: 'Travellers', value: travellerSummary(booking) },
    { label: 'Pickup', value: booking.pickupPoint || '—' },
    { label: 'Amount paid', value: formatRupees(booking.amountPaid) },
    { label: 'Balance due', value: formatRupees(booking.balanceDue) },
  ];
  const nextSteps = settings.booking.nextSteps ?? [];

  return (
    <>
      <Header variant="solid" active="packages" />
      {booking.status === 'pending' && <RefreshWhilePending />}
      <main className="flex flex-1 flex-col items-center gap-5 bg-page px-5 pt-8 pb-10 lg:gap-7 lg:pt-16 lg:pb-20">
        <div className="flex w-full max-w-[820px] flex-col items-center gap-4 rounded-[var(--radius-panel)] border border-line bg-surface p-6 text-center lg:gap-[18px] lg:p-12">
          <span
            aria-hidden="true"
            className={`flex size-16 items-center justify-center rounded-full lg:size-20 ${confirmed ? 'bg-success-bg' : 'bg-sand'}`}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke={confirmed ? '#2B5243' : '#A2481A'}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icon === 'clock' && <circle cx="12" cy="12" r="8" />}
              <path d={ICON_PATHS[icon]} />
            </svg>
          </span>
          <h1 className="text-[24px] leading-[34px] font-extrabold tracking-[-0.6px] lg:text-[32px] lg:leading-[48px] lg:tracking-[-1px]">
            {title}
          </h1>
          <p className="text-[15px] leading-6 text-body lg:text-[17px] lg:leading-[27px]">{text}</p>
          <div className="rounded-[10px] bg-sand px-[18px] py-2.5 text-[15px]">
            Booking ID <strong className="tracking-[1px]">{booking.bookingNumber}</strong>
          </div>
          <dl className="mt-2 grid w-full gap-3 text-left sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {details.map((detail) => (
              <div key={detail.label} className="rounded-xl border border-line p-4">
                <dt className="text-[13px] text-muted">{detail.label}</dt>
                <dd className="mt-1 text-base font-bold">{detail.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button href={`/account/bookings/${booking.bookingNumber}`}>View booking</Button>
            <Button href="/" variant="ghost">
              Back to home
            </Button>
          </div>
        </div>

        {confirmed && nextSteps.length > 0 && (
          <section
            aria-label="What happens next"
            className="grid w-full max-w-[820px] gap-3 lg:grid-cols-3 lg:gap-4"
          >
            {nextSteps.map((step, index) => (
              <div key={step.title} className="rounded-[14px] border border-line bg-surface p-5">
                <div className="text-[20px] font-extrabold text-gold">{pad(index + 1)}</div>
                <div className="mt-1.5 text-[15px] font-bold">{step.title}</div>
                <div className="mt-1 text-sm leading-[21px] text-muted">{step.text}</div>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
