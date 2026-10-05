import { formatDate, formatRupees } from '@/domain/format';
import { PAYMENT_METHOD_LABELS, PAYMENT_TYPE_LABELS } from '@/domain/enums';
import { Pill } from '@/components/ui/Pill';
import { DetailSection } from './DetailSection';

// Customer-facing payment status wording.
const RECORD_STATUS = {
  created: { label: 'Not completed', tone: 'muted' },
  captured: { label: 'Paid', tone: 'success' },
  recorded: { label: 'Paid', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
  refunded: { label: 'Refunded', tone: 'muted' },
};

export function PaymentsList({ payments }) {
  return (
    <DetailSection title="Payments">
      {payments.length === 0 ? (
        <p className="text-sm text-muted">No payments yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {payments.map((payment, index) => {
            const status = RECORD_STATUS[payment.status];
            return (
              <li
                key={`${payment.paymentType}-${index}`}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold">{PAYMENT_TYPE_LABELS[payment.paymentType]}</span>
                  <span className="text-[13px] text-muted">
                    {PAYMENT_METHOD_LABELS[payment.method]}
                    {payment.paidAt && ` · ${formatDate(payment.paidAt)}`}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[15px] font-bold">{formatRupees(payment.amount)}</span>
                  <Pill tone={status.tone}>{status.label}</Pill>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DetailSection>
  );
}
