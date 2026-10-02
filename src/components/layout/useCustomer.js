'use client';

import { useEffect, useState } from 'react';
import { clientApi } from '@/lib/api';

/**
 * The logged-in customer for client components: `undefined` while loading, `null` when logged out.
 * Pages stay statically cached because the account state is fetched in the browser.
 */
export function useCustomer() {
  const [customer, setCustomer] = useState(undefined);
  useEffect(() => {
    let active = true;
    clientApi
      .get('/auth/session')
      .then(({ data }) => active && setCustomer(data))
      .catch(() => active && setCustomer(null));
    return () => {
      active = false;
    };
  }, []);
  return customer;
}

export async function logout() {
  await clientApi.post('/auth/logout').catch(() => {});
  // A full reload (not router.push) so every component holding the customer resets.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign('/');
}
