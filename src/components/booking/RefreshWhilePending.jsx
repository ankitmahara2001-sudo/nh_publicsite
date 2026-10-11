'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const REFRESH_EVERY_MS = 4000;
const MAX_REFRESHES = 15;

/**
 * Re-renders the confirmation page every few seconds (for about a minute) while the payment is
 * still being confirmed by the Razorpay webhook.
 */
export function RefreshWhilePending() {
  const router = useRouter();
  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      if (count > MAX_REFRESHES) clearInterval(timer);
      else router.refresh();
    }, REFRESH_EVERY_MS);
    return () => clearInterval(timer);
  }, [router]);
  return null;
}
