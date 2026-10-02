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
      <h1 className="text-[28px] leading-9 font-extrabold tracking-[-0.6px] lg:text-[32px] lg:leading-10">
        Something went wrong
      </h1>
      <p className="mt-3 text-[15px] leading-6 text-body lg:text-base">
        We couldn’t load this page. Please try again in a moment.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={() => retry()}>Try again</Button>
        <Button href="/" variant="outline">
          Go to home
        </Button>
      </div>
    </CenteredPage>
  );
}
