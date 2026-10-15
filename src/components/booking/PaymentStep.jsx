'use client';

import Link from 'next/link';
import { Checkbox } from '@/components/ui/FormFields';
import { OptionCard } from '@/components/ui/OptionCard';

export const PAYMENT_METHODS = [
  { value: 'upi', label: 'UPI', note: 'GPay, PhonePe, Paytm' },
  { value: 'card', label: 'Card', note: 'Credit or debit card' },
  { value: 'netbanking', label: 'Netbanking', note: 'All major banks' },
];

const DEFAULT_TERMS = 'I agree to the booking terms and cancellation policy';

/**
 * Step 3 (design/Booking.dc.html "Payment"): preferred method (Razorpay opens on it; the customer
 * can still switch there) and the terms checkbox.
 */
export function PaymentStep({ details, setDetails, termsText, errors }) {
  return (
    <div className="flex flex-col gap-4 lg:gap-[22px]">
      <h2 className="text-xl font-extrabold lg:text-[21px]">Payment</h2>
      <p className="text-sm leading-[22px] text-body lg:text-base lg:leading-[26px]">
        You will pay securely on Razorpay. Your booking is confirmed as soon as the payment goes through.
      </p>
      <div role="radiogroup" aria-label="Payment method" className="grid gap-2.5 lg:grid-cols-3 lg:gap-3">
        {PAYMENT_METHODS.map((method) => (
          <OptionCard
            key={method.value}
            selected={details.method === method.value}
            onSelect={() => setDetails({ method: method.value })}
            title={method.label}
            note={method.note}
          />
        ))}
      </div>
      <Checkbox
        checked={details.acceptTerms}
        onChange={(e) => setDetails({ acceptTerms: e.target.checked })}
        error={errors.acceptTerms}
        label={
          <>
            {termsText || DEFAULT_TERMS} (
            <Link href="/policies/cancellation" target="_blank" className="font-bold text-navy underline">
              cancellation policy
            </Link>
            )
          </>
        }
      />
    </div>
  );
}
