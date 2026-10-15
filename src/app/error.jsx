'use client'; // Error boundaries must be client components.

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CenteredPage } from '@/components/ui/CenteredPage';

/**
 * Fallback for unexpected errors below the root layout. The root layout (and its footer) still
 * renders; the header is a server component, so it is not repeated here.
 */
export default function ErrorPage({ error, retry }) {
  useEffect(() => {
    // Shown in the browser console only; server errors carry a digest that matches the server log.
    console.error(error);
  }, [error]);

  return (
    <CenteredPage className="text-center">
      <p className="font-hand text-[20px] text-gold-text">a rockfall on the road —</p>
      <h1 className="mt-2 text-[26px] leading-[1.1] lg:text-[32px]">Something went wrong</h1>
      <p className="mt-3 text-[15px] leading-6 text-muted lg:text-base">
        We couldn’t load this page. Please try again in a moment.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="accent" onClick={() => retry()}>
          Try again
        </Button>
        <Button href="/" variant="outline">
          Go to home
        </Button>
      </div>
    </CenteredPage>
  );
}
