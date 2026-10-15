'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { enquiryHref } from '@/lib/enquiry';
import { telHref } from '@/lib/links';
import { LogoMark } from './Logo';
import { ACCOUNT_LINKS, NAV_LINKS } from './navigation';
import { logout, useCustomer } from './useCustomer';

const MENU_LINKS = [{ key: 'home', label: 'Home', href: '/' }, ...NAV_LINKS];

/** Full-screen Deodar menu for phones and tablets (design: Mobile-Home menu drawer) plus login / account links. */
export function MobileMenu({ company, active, onClose }) {
  const customer = useCustomer();
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const linkClass = 'flex min-h-12 items-center py-1.5 font-display text-[24px] leading-tight sm:text-[24px]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-navy text-page xl:hidden"
    >
      <svg
        viewBox="0 0 390 300"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 h-[260px] w-full"
      >
        <path
          d="M0 300 L0 160 L60 110 L100 130 L170 50 L210 90 L250 70 L310 130 L390 100 L390 300 Z"
          fill="#1d3d32"
        />
        <path d="M0 300 L0 230 L390 210 L390 300 Z" fill="#2b5243" />
        <path d="M170 50 L195 75 L185 71 L175 81 L165 72 L151 75 Z" fill="#f5f1e8" opacity=".9" />
      </svg>
      <div className="relative flex h-[72px] shrink-0 items-center justify-between px-4">
        <span className="flex items-center gap-2">
          <LogoMark tone="light" />
          <span className="font-display text-[19px]">{company.name}</span>
        </span>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-full border border-page/35"
        >
          <svg
            width="20"
            height="20"
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
      <nav aria-label="Main" className="relative flex flex-col px-6 py-4">
        {MENU_LINKS.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            onClick={onClose}
            aria-current={link.key === active ? 'page' : undefined}
            className={`${linkClass} ${link.key === active ? 'text-gold-light' : ''}`}
          >
            {link.label}
          </Link>
        ))}
        {customer &&
          ACCOUNT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`${linkClass} text-gold-light`}
            >
              {link.label}
            </Link>
          ))}
      </nav>
      <div className="relative mt-auto flex flex-col gap-4 px-6 pt-4 pb-9">
        <div className="flex gap-2.5">
          {customer ? (
            <button
              type="button"
              onClick={logout}
              className={buttonClasses({ variant: 'outline-light', size: 'lg', className: 'flex-1' })}
            >
              Log out
            </button>
          ) : (
            customer === null && (
              <Link
                href="/login"
                onClick={onClose}
                className={buttonClasses({ variant: 'outline-light', size: 'lg', className: 'flex-1' })}
              >
                Login
              </Link>
            )
          )}
          <Link
            href={enquiryHref()}
            onClick={onClose}
            className={buttonClasses({ variant: 'accent', size: 'lg', className: 'flex-1' })}
          >
            Enquire now
          </Link>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm text-footer-text">
          {company.phone && <a href={telHref(company.phone)}>{company.phone}</a>}
          {company.email && <a href={`mailto:${company.email}`}>{company.email}</a>}
        </div>
      </div>
    </div>
  );
}
