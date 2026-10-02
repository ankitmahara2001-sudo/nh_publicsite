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
        'h-11 shrink-0 font-bold transition',
        variant === 'pill'
          ? cn(
              'rounded-full border border-navy px-4 text-sm',
              copied ? 'bg-navy text-white' : 'bg-surface text-navy',
            )
          : 'px-1.5 text-[13px] text-navy lg:text-sm',
        className,
      )}
    >
      {copied ? (
        'Copied ✓'
      ) : (
        <span>
          Copy<span className={variant === 'text' ? 'hidden lg:inline' : ''}> code</span>
        </span>
      )}
      <span className="sr-only"> {code}</span>
    </button>
  );
}
