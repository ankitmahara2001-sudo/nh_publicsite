'use client';

import { useEffect, useState } from 'react';

const TICK_MS = 1000;

/** Seconds left on a countdown; `start(seconds)` (re)starts it. */
export function useCountdown(initialSeconds = 0) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), TICK_MS);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return { secondsLeft, start: setSecondsLeft };
}
