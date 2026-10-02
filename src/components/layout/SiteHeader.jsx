'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { AccountMenu } from './AccountMenu';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS } from './navigation';

/**
 * Site header (design/Header.dc.html + MobileHeader.dc.html).
 * `variant="transparent"` sits over a hero photo (white text); `variant="solid"` is white.
 * `active` = key of the current section ("packages", "blog"…), shown with the gold underline.
 */
export function SiteHeader({ variant = 'transparent', active, company }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const light = variant === 'transparent';

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'relative z-20 border-b',
          light ? 'border-white/14 bg-transparent text-white' : 'border-line bg-surface text-ink',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between pr-3 pl-5 lg:h-[88px] lg:px-20">
          <Logo name={company.name} className="lg:w-[280px]" />

          <nav aria-label="Main" className="hidden gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = link.key === active;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'border-b-2 py-1.5 text-[15px] transition',
                    isActive ? 'border-gold font-bold' : 'border-transparent font-medium',
                    light && !isActive && 'opacity-[0.88] hover:opacity-100',
                    !light && !isActive && 'hover:text-gold-text',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 lg:w-[280px] lg:justify-end lg:gap-5">
            <Link
              href="/packages"
              aria-label="Search packages"
              className={cn(
                'hidden size-11 items-center justify-center rounded-full lg:flex',
                light ? 'hover:bg-white/10' : 'hover:bg-selected',
              )}
            >
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
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className={buttonClasses({
                variant: 'accent',
                size: 'custom',
                className: 'h-9 px-3.5 text-[13px] lg:h-11 lg:px-[22px] lg:text-[15px]',
              })}
            >
              <span className="lg:hidden">Enquire</span>
              <span className="hidden lg:inline">Enquire now</span>
            </Link>
            <div className="hidden lg:block">
              <AccountMenu light={light} />
            </div>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="flex size-11 items-center justify-center lg:hidden"
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
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {menuOpen && <MobileMenu company={company} active={active} onClose={() => setMenuOpen(false)} />}
    </>
  );
}
