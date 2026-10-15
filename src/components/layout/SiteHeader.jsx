'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { enquiryHref } from '@/lib/enquiry';
import { cn } from '@/lib/cn';
import { AccountMenu } from './AccountMenu';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS } from './navigation';

/**
 * Site header (design: Main / Package / Gallery / Blog headers, Mobile-Home header).
 * `variant="transparent"` sits over the home hero photo (snow text); `variant="solid"` is the
 * Deodar bar of the inner pages. `active` = key of the current section ("packages", "blog"…),
 * shown in light marigold.
 */
export function SiteHeader({ variant = 'transparent', active, company }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const transparent = variant === 'transparent';

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className={cn('relative z-20 text-page', transparent ? 'bg-transparent' : 'bg-navy')}>
        <div
          className={cn(
            'mx-auto flex max-w-[1280px] items-center justify-between gap-6 pr-4 pl-4 lg:px-8',
            transparent ? 'h-[72px] lg:h-[88px]' : 'h-[68px] lg:h-[76px]',
          )}
        >
          <Logo name={company.name} tone="light" />

          <nav aria-label="Main" className="hidden items-center gap-[26px] xl:flex">
            {NAV_LINKS.map((link) => {
              const isActive = link.key === active;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'py-1.5 text-[15px] font-medium transition',
                    isActive ? 'text-gold-light' : 'text-footer-text hover:text-gold-light',
                    transparent && !isActive && 'text-page/90',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 lg:gap-3">
            <div className="hidden lg:block">
              <AccountMenu light />
            </div>
            <span className="hidden lg:block">
              <Link
                href={enquiryHref()}
                className={buttonClasses({
                  variant: transparent ? 'primary' : 'accent',
                  size: 'custom',
                  className: 'h-11 px-5 text-[15px]',
                })}
              >
                Enquire now
              </Link>
            </span>
            <div className="lg:hidden">
              <AccountMenu light compact />
            </div>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className={cn(
                'flex size-11 items-center justify-center rounded-full xl:hidden',
                transparent ? 'bg-navy text-page' : 'border border-page/35 text-page',
              )}
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
                <path d="M4 7h16M4 12h16M4 17h11" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {menuOpen && <MobileMenu company={company} active={active} onClose={() => setMenuOpen(false)} />}
    </>
  );
}
