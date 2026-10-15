import Link from 'next/link';
import { telHref } from '@/lib/links';
import { Logo } from './Logo';

export function SocialIcon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true,
  };
  if (name === 'instagram') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
      </svg>
    );
  }
  if (name === 'facebook') {
    return (
      <svg {...common} strokeLinejoin="round">
        <path d="M14 21v-8h3l.5-3.5H14V7.5c0-1 .3-1.7 1.8-1.7H18V2.7a24 24 0 0 0-2.6-.2C12.9 2.5 11 4 11 6.9v2.6H8V13h3v8" />
      </svg>
    );
  }
  return (
    <svg {...common} strokeLinejoin="round">
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" />
    </svg>
  );
}

function FooterLink({ label, href }) {
  const className = 'text-[15px] break-words text-footer-text transition hover:text-gold-light';
  return href.startsWith('/') ? (
    <Link href={href} className={className}>
      {label}
    </Link>
  ) : (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

/**
 * Site footer (design: Main footer with the ridge silhouette edge; Mobile-Home footer with collapsible
 * columns). Contact and social come from settings.
 */
export function Footer({ company, social }) {
  const columns = [
    {
      title: 'Explore',
      links: [
        ['Destinations', '/destinations'],
        ['Packages', '/packages'],
        ['Offers', '/offers'],
        ['Gallery', '/gallery'],
      ],
    },
    {
      title: 'Company',
      links: [
        ['About us', '/about'],
        ['Blog', '/blog'],
        ['Contact', '/contact'],
      ],
    },
    {
      title: 'Support',
      links: [
        ['Booking support', '/contact'],
        ['Cancellation policy', '/policies/cancellation'],
        ['Privacy policy', '/policies/privacy'],
        ['Terms', '/policies/terms'],
      ],
    },
    {
      title: 'Contact',
      links: [
        company.phone && [company.phone, telHref(company.phone)],
        company.email && [company.email, `mailto:${company.email}`],
        company.shortAddress && [company.shortAddress, '/contact'],
      ].filter(Boolean),
    },
  ];
  const socials = ['instagram', 'facebook', 'youtube'].filter((name) => social?.[name]);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-footer-text">
      {/* Ridge silhouette edge (design kit "Section edge"). */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block h-10 w-full bg-page lg:h-[60px]"
      >
        <path
          d="M0 60 L0 40 L80 22 L150 34 L240 8 L320 30 L420 14 L520 36 L610 18 L720 32 L820 6 L910 28 L1010 16 L1110 34 L1200 12 L1300 30 L1380 20 L1440 28 L1440 60 Z"
          fill="#12261f"
        />
      </svg>
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <div className="flex flex-col gap-5 pt-6 pb-6 lg:grid lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] lg:gap-9 lg:pt-12 lg:pb-8">
          <div className="flex flex-col gap-3.5">
            <Logo name={company.name} tone="light" />
            {company.tagline && (
              <p className="font-hand text-[19px] leading-snug text-gold-light">{company.tagline}</p>
            )}
            {socials.length > 0 && (
              <div className="flex gap-2.5">
                {socials.map((name) => (
                  <a
                    key={name}
                    href={social[name]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name.charAt(0).toUpperCase() + name.slice(1)}
                    className="flex size-11 items-center justify-center rounded-full border border-page/30 text-page transition hover:border-gold"
                  >
                    <SocialIcon name={name} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Phones: one collapsible group per column. */}
          <div className="lg:hidden">
            {columns.map((column) => (
              <details key={column.title} className="group border-t border-footer-line">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-bold text-page [&::-webkit-details-marker]:hidden">
                  {column.title}
                  <span aria-hidden="true" className="text-xl text-gold-light group-open:hidden">
                    +
                  </span>
                  <span aria-hidden="true" className="hidden text-xl text-gold-light group-open:inline">
                    –
                  </span>
                </summary>
                <div className="flex flex-col gap-2.5 pb-4">
                  {column.links.map(([label, href]) => (
                    <FooterLink key={label} label={label} href={href} />
                  ))}
                </div>
              </details>
            ))}
          </div>

          {/* Desktop: columns. */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="hidden flex-col gap-2.5 lg:flex">
              <span className="text-xs font-bold tracking-[.18em] text-gold-light uppercase">
                {column.title}
              </span>
              {column.links.map(([label, href]) => (
                <FooterLink key={label} label={label} href={href} />
              ))}
            </nav>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 border-t border-footer-line pt-5 pb-8 text-[13px] text-footer-muted lg:flex-row lg:justify-between lg:gap-4 lg:pt-[22px] lg:text-sm">
          <span>
            © {year} {company.legalName || company.name}. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            Secure payments by Razorpay · UPI, cards, netbanking
          </span>
        </div>
      </div>
    </footer>
  );
}
