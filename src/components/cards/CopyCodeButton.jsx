'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

const COPIED_MS = 2000;

/** "Copy code" → "Copied ✓" (design: Offers and home offer cards). */
export function CopyCodeButton({ code, variant = 'text', className }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard can be blocked (http, old browsers); the code stays visible to copy by hand.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={cn(
        'inline-flex h-11 shrink-0 items-center justify-center gap-1.5 font-bold transition',
        variant === 'pill'
          ? cn(
              'rounded-full border border-navy px-3 text-[13px] lg:px-4 lg:text-[15px]',
              copied ? 'bg-navy text-page' : 'bg-transparent text-ink hover:bg-navy/10',
            )
          : 'px-1.5 text-[13px] text-ink underline lg:text-sm',
        className,
      )}
    >
      {copied ? (
        // Design microcopy: "Code copied — happy trails!"
        <span>Copied ✓</span>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="hidden sm:block"
          >
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a1 1 0 0 1 1-1h10" />
          </svg>
          <span>
            Copy<span className={variant === 'text' ? 'hidden lg:inline' : ''}> code</span>
          </span>
        </>
      )}
      <span className="sr-only"> {code}</span>
    </button>
  );
}
