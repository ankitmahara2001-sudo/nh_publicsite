'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { telHref } from '@/lib/links';
import { LogoMark } from './Logo';
import { ACCOUNT_LINKS, NAV_LINKS } from './navigation';
import { logout, useCustomer } from './useCustomer';

const MENU_LINKS = [{ key: 'home', label: 'Home', href: '/' }, ...NAV_LINKS];

/** Full-screen navy menu for phones (design/MobileMenu.dc.html) plus login / account links. */
export function MobileMenu({ company, onClose }) {
  const customer = useCustomer();
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const linkClass = 'flex h-[58px] items-center justify-between border-b border-[#1E2C40] text-xl font-bold';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-navy text-white lg:hidden"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-footer-line pr-3 pl-5">
        <span className="flex items-center gap-2">
          <LogoMark />
          <span className="text-[17px] font-extrabold">{company.name}</span>
        </span>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="flex size-11 items-center justify-center"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <nav aria-label="Main" className="flex flex-col px-5 py-3">
        {MENU_LINKS.map((link) => (
          <Link key={link.key} href={link.href} onClick={onClose} className={linkClass}>
            {link.label}
            <span aria-hidden="true" className="text-[#6F7A8B]">
              ›
            </span>
          </Link>
        ))}
        {customer
          ? ACCOUNT_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={onClose} className={linkClass}>
                {link.label}
                <span aria-hidden="true" className="text-[#6F7A8B]">
                  ›
                </span>
              </Link>
            ))
          : customer === null && (
              <Link href="/login" onClick={onClose} className={linkClass}>
                Log in
                <span aria-hidden="true" className="text-[#6F7A8B]">
                  ›
                </span>
              </Link>
            )}
        {customer && (
          <button type="button" onClick={logout} className={`${linkClass} text-left text-gold-light`}>
            Log out
          </button>
        )}
      </nav>
      <div className="mt-auto flex flex-col gap-3.5 p-5">
        <Link
          href="/contact"
          onClick={onClose}
          className={buttonClasses({ variant: 'accent', size: 'lg', block: true })}
        >
          Enquire now
        </Link>
        <div className="flex justify-between gap-3 text-sm text-footer-text">
          {company.phone && <a href={telHref(company.phone)}>{company.phone}</a>}
          {company.email && <a href={`mailto:${company.email}`}>{company.email}</a>}
        </div>
      </div>
    </div>
  );
}
