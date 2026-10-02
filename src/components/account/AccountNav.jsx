'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ACCOUNT_LINKS } from '@/components/layout/navigation';
import { logout } from '@/components/layout/useCustomer';
import { cn } from '@/lib/cn';

const LINK_CLASSES = 'flex h-11 items-center rounded-full px-4 text-sm font-bold transition';

/** "My bookings / Profile / Log out" tabs shown on every account page. */
export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0">
      {ACCOUNT_LINKS.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              LINK_CLASSES,
              isActive ? 'bg-navy text-white' : 'border border-line bg-surface text-navy hover:bg-selected',
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        className={cn(LINK_CLASSES, 'border border-line bg-surface text-danger hover:bg-selected')}
      >
        Log out
      </button>
    </nav>
  );
}
