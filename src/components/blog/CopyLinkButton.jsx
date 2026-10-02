'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

const COPIED_MS = 2000;

/** "Copy link" → "Link copied ✓" for the current article URL. */
export function CopyLinkButton({ url, className }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // Clipboard can be blocked (http, old browsers); the address bar still has the link.
      window.prompt('Copy this link:', url);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={cn(className, copied && 'border-navy bg-navy text-white')}
    >
      {copied ? 'Link copied ✓' : 'Copy link'}
    </button>
  );
}
