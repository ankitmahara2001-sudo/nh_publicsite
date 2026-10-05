import { formatRupees } from '@/domain/format';
import { quantityLine } from '@/components/booking/PriceBreakdown';
import { DetailRows, DetailSection } from './DetailSection';

function breakdownRows(booking) {
  const rows = [
    {
      label: `${booking.priceLabel} · ${quantityLine(booking)}`,
      value: formatRupees(booking.subtotal),
    },
  ];
  if (booking.discountAmount > 0) {
    rows.push({
      label: `Coupon ${booking.couponCode ?? ''}`.trim(),
      value: `− ${formatRupees(booking.discountAmount)}`,
    });
  }
  rows.push(
    { label: `GST (${booking.gstPercent}%)`, value: formatRupees(booking.gstAmount) },
    { label: 'Total', value: formatRupees(booking.totalAmount), emphasis: true },
    { label: `Booking amount (${booking.bookingAmountPercent}%)`, value: formatRupees(booking.payNowAmount) },
    { label: 'Paid', value: formatRupees(booking.amountPaid) },
  );
  if (booking.refundedAmount > 0)
    rows.push({ label: 'Refunded', value: formatRupees(booking.refundedAmount) });
  rows.push({ label: 'Balance due', value: formatRupees(booking.balanceDue), emphasis: true });
  return rows;
}

/** Price snapshot of a saved booking (the booking flow's PriceBreakdown shows a live quote): unit × quantity, coupon, GST, total, paid and balance. */
export function PaymentSummary({ booking }) {
  return (
    <DetailSection title="Price breakdown">
      <DetailRows rows={breakdownRows(booking)} />
      {booking.balanceDue > 0 && booking.status !== 'cancelled' && (
        <p className="mt-5 rounded-[var(--radius-control)] bg-sand-light p-4 text-sm leading-[22px] text-body">
          Balance is collected before departure; our team will contact you.
        </p>
      )}
    </DetailSection>
  );
}
