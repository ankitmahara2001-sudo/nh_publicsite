'use client';

import { useCallback } from 'react';

// Razorpay Checkout (UPI, cards, netbanking) in a popup. The script is loaded on first use.

const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';
const BRAND_COLOR = '#0F1B2D';

let scriptPromise = null;
function loadCheckoutScript() {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('The payment window could not be loaded. Check your connection and try again.'));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Returns `openCheckout(checkout, { companyName, method, onSuccess, onFailure, onDismiss })`.
 * `checkout` is the `checkout` object from POST /bookings. `method` (upi | card | netbanking)
 * opens Razorpay on that method; the customer can still switch inside the popup.
 */
export function useRazorpayCheckout() {
  return useCallback(async (checkout, { companyName, method, onSuccess, onFailure, onDismiss }) => {
    await loadCheckoutScript();
    const razorpay = new window.Razorpay({
      key: checkout.keyId,
      order_id: checkout.orderId,
      amount: checkout.amount,
      currency: checkout.currency,
      name: companyName,
      description: checkout.description,
      prefill: { name: checkout.name, email: checkout.email, contact: checkout.phone, method },
      theme: { color: BRAND_COLOR },
      handler: (response) =>
        onSuccess({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      modal: { ondismiss: onDismiss },
    });
    razorpay.on('payment.failed', (response) => onFailure(response.error?.description));
    razorpay.open();
  }, []);
}
