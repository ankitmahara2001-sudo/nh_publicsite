import { formatDateRange, formatRupees } from '@/domain/format';
import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { BookingStatusPills } from './BookingStatusPills';
import { travellerSummary } from './travellerCount';

function Amount({ label, value, strong }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted lg:text-[13px]">{label}</dt>
      <dd className={strong ? 'text-base font-extrabold lg:text-lg' : 'text-[15px] font-bold'}>{value}</dd>
    </div>
  );
}

/** One booking in "My bookings". */
export function BookingCard({ booking }) {
  const href = `/account/bookings/${booking.bookingNumber}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface sm:flex-row">
      <div className="relative h-40 shrink-0 bg-placeholder sm:h-auto sm:w-56 lg:w-64">
        <Photo src={booking.coverImageUrl} alt="" sizes="(min-width: 640px) 256px, 100vw" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 lg:p-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold tracking-[1.6px] text-gold-text uppercase">
            {booking.bookingNumber}
          </p>
          <h2 className="text-lg leading-6 font-bold lg:text-[20px] lg:leading-7">{booking.packageTitle}</h2>
          <p className="text-sm text-body">
            {formatDateRange(booking.travelDate, booking.endDate)} · {travellerSummary(booking)}
          </p>
          <BookingStatusPills status={booking.status} paymentStatus={booking.paymentStatus} />
        </div>
        <div className="mt-auto flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-end sm:justify-between">
          <dl className="flex gap-8">
            <Amount label="Total" value={formatRupees(booking.totalAmount)} strong />
            <Amount label="Balance due" value={formatRupees(booking.balanceDue)} />
          </dl>
          <Link href={href} className={buttonClasses({ variant: 'outline', size: 'sm' })}>
            View booking <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
