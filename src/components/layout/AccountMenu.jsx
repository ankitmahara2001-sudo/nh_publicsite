'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { ACCOUNT_LINKS } from './navigation';
import { logout, useCustomer } from './useCustomer';

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a7 7 0 0 1 16 0v1" />
    </svg>
  );
}

/** Header account icon: "Log in" link when logged out, a small menu when logged in. */
export function AccountMenu({ light }) {
  const customer = useCustomer();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => !ref.current?.contains(event.target) && setOpen(false);
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const iconButton = cn(
    'flex size-11 items-center justify-center rounded-full',
    light ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-selected',
  );

  if (!customer) {
    return (
      <Link href="/login" aria-label="Log in or create an account" className={iconButton}>
        <UserIcon />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="My account"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={iconButton}
      >
        <UserIcon />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface py-1 text-ink shadow-xl"
        >
          <p className="truncate px-4 py-2 text-xs text-muted">{customer.name || customer.email}</p>
          {ACCOUNT_LINKS.map((link) => (
            <Link
              key={link.href}
              role="menuitem"
              href={link.href}
              className="block px-4 py-2.5 text-sm font-semibold hover:bg-selected"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-danger hover:bg-selected"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
