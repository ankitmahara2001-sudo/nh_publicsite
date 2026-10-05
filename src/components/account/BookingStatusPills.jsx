import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/domain/enums';
import { Pill } from '@/components/ui/Pill';

const STATUS_TONES = { pending: 'sand', confirmed: 'success', completed: 'navy', cancelled: 'danger' };
const PAYMENT_TONES = { unpaid: 'muted', advance_paid: 'sand', fully_paid: 'success', refunded: 'muted' };

/** Booking status + payment status chips. */
export function BookingStatusPills({ status, paymentStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Pill tone={STATUS_TONES[status]}>{BOOKING_STATUS_LABELS[status]}</Pill>
      <Pill tone={PAYMENT_TONES[paymentStatus]}>{PAYMENT_STATUS_LABELS[paymentStatus]}</Pill>
    </div>
  );
}
