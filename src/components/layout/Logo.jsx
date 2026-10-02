import Link from 'next/link';
import { cn } from '@/lib/cn';

export function LogoMark({ className }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('size-[26px] lg:size-[30px]', className)}
    >
      <path
        d="M3 26 L12 10 L17 18 L21 12 L29 26 Z"
        stroke="#C8893A"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="7" r="2.5" fill="#C8893A" />
    </svg>
  );
}

export function Logo({ name, className }) {
  return (
    <Link
      href="/"
      aria-label={`${name} home`}
      className={cn('flex items-center gap-2 lg:gap-2.5', className)}
    >
      <LogoMark />
      <span className="text-[17px] font-extrabold tracking-[-0.3px] lg:text-[19px] lg:tracking-[-0.4px]">
        {name}
      </span>
    </Link>
  );
}
