'use client';

import { useEffect, useState } from 'react';
import { ApiError, clientApi } from '@/lib/api';

const DEBOUNCE_MS = 250;

/**
 * Live price quote from POST /pricing/quote. Re-runs (debounced) whenever the request changes.
 * Returns { quote, fieldErrors, error, loading }; `request` null = nothing to quote yet.
 */
export function useQuote(request) {
  // `forKey` remembers which request the result belongs to; loading = the latest request has no result yet.
  const [state, setState] = useState({ forKey: null, quote: null, fieldErrors: {}, error: null });
  const key = request ? JSON.stringify(request) : null;

  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const { data } = await clientApi.post('/pricing/quote', JSON.parse(key));
        if (!cancelled) setState({ forKey: key, quote: data, fieldErrors: {}, error: null });
      } catch (error) {
        if (cancelled) return;
        const fieldErrors = error instanceof ApiError ? error.fields : {};
        setState({ forKey: key, quote: null, fieldErrors, error: error.message });
      }
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [key]);

  const { quote, fieldErrors, error } = state;
  return { quote, fieldErrors, error, loading: Boolean(key) && state.forKey !== key };
}
