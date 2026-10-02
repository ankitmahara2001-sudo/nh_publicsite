import { formatDate, formatDateRange } from '@nh/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AccountHeading } from '@/components/account/AccountHeading';
import { BookingStatusPills } from '@/components/account/BookingStatusPills';
import { DetailRows, DetailSection } from '@/components/account/DetailSection';
import { PaymentsList } from '@/components/account/PaymentsList';
import { PaymentSummary } from '@/components/account/PaymentSummary';
import { travellerSummary } from '@/components/account/travellerCount';
import { TravellersTable } from '@/components/account/TravellersTable';
import { requireCustomerPage } from '@/lib/account';
import { ApiError } from '@/lib/api';
import { getAsCustomer } from '@/lib/server';

export async function generateMetadata({ params }) {
  const { bookingNumber } = await params;
  return { title: `Booking ${bookingNumber}` };
}

async function loadBooking(bookingNumber) {
  try {
    return (await getAsCustomer(`/me/bookings/${encodeURIComponent(bookingNumber)}`)).data;
  } catch (error) {
    // 400 = malformed number, 404 = not this customer's booking: both are "not found" here.
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }
}

function tripRows(booking) {
  const rows = [
    { label: 'Dates', value: formatDateRange(booking.travelDate, booking.endDate) },
    { label: 'Travellers', value: travellerSummary(booking) },
    { label: 'Pickup point', value: booking.pickupPoint || '—' },
    { label: 'Lead traveller', value: booking.leadName },
    { label: 'Email', value: booking.leadEmail },
    { label: 'Phone', value: booking.leadPhone },
    { label: 'Booked on', value: formatDate(booking.createdAt) },
  ];
  if (booking.specialRequests) rows.push({ label: 'Special requests', value: booking.specialRequests });
  return rows;
}

function PackageTitle({ booking }) {
  if (!booking.packageSlug) return booking.packageTitle;
  return (
    <Link href={`/packages/${booking.packageSlug}`} className="hover:text-gold-text">
      {booking.packageTitle}
    </Link>
  );
}

export default async function BookingDetailPage({ params }) {
  const { bookingNumber } = await params;
  await requireCustomerPage(`/account/bookings/${bookingNumber}`);
  const booking = await loadBooking(bookingNumber);

  return (
    <article className="flex flex-col gap-5 lg:gap-6">
      <Link href="/account/bookings" className="self-start text-sm font-bold text-navy hover:text-gold-text">
        <span aria-hidden="true">←</span> All bookings
      </Link>
      <header className="flex flex-col gap-3">
        <p className="text-xs font-bold tracking-[2px] text-gold-text uppercase lg:tracking-[2.4px]">
          Booking {booking.bookingNumber}
        </p>
        <AccountHeading>
          <PackageTitle booking={booking} />
        </AccountHeading>
        <BookingStatusPills status={booking.status} paymentStatus={booking.paymentStatus} />
        {booking.status === 'cancelled' && booking.cancelReason && (
          <p className="text-sm text-danger">Cancelled: {booking.cancelReason}</p>
        )}
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-6">
        <div className="flex flex-col gap-5 lg:gap-6">
          <DetailSection title="Trip">
            <DetailRows rows={tripRows(booking)} />
          </DetailSection>
          <TravellersTable travellers={booking.travellers} />
        </div>
        <div className="flex flex-col gap-5 lg:gap-6">
          <PaymentSummary booking={booking} />
          <PaymentsList payments={booking.payments} />
        </div>
      </div>
    </article>
  );
}
