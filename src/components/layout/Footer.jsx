import Link from 'next/link';
import { telHref } from '@/lib/links';
import { Logo } from './Logo';

function SocialIcon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true,
  };
  if (name === 'instagram') {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    );
  }
  if (name === 'facebook') {
    return (
      <svg {...common} strokeLinejoin="round">
        <path d="M14 21v-8h3l.5-3.5H14V7.5c0-1 .5-2 2-2h1.7v-3S16 2.2 14.5 2.2C11.8 2.2 10.5 4 10.5 6.8v2.7h-3V13h3v8" />
      </svg>
    );
  }
  return (
    <svg {...common} strokeLinejoin="round">
      <rect x="3" y="5.5" width="18" height="13" rx="3.5" />
      <path d="M10 9.5l4.5 2.5-4.5 2.5z" />
    </svg>
  );
}

/** Site footer (design/Footer.dc.html + MobileFooter.dc.html). Contact and social come from settings. */
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
    <footer className="bg-navy text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-7 px-5 pt-10 pb-7 lg:gap-14 lg:px-20 lg:pt-[72px] lg:pb-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-3 lg:w-[340px] lg:gap-[18px]">
            <Logo name={company.name} />
            {company.tagline && (
              <p className="text-sm leading-[22px] text-footer-text lg:text-[15px] lg:leading-6">
                {company.tagline}
              </p>
            )}
            {socials.length > 0 && (
              <div className="order-last flex gap-2.5 lg:order-none">
                {socials.map((name) => (
                  <a
                    key={name}
                    href={social[name]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name.charAt(0).toUpperCase() + name.slice(1)}
                    className="flex size-11 items-center justify-center rounded-full border border-footer-ring hover:border-gold"
                  >
                    <SocialIcon name={name} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6 lg:flex lg:gap-0">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-2.5 lg:min-w-[170px] lg:gap-3.5">
                <p className="text-sm font-bold lg:text-[15px]">{column.title}</p>
                {column.links.map(([label, href]) =>
                  href.startsWith('/') ? (
                    <Link key={label} href={href} className="text-sm text-footer-text hover:text-white">
                      {label}
                    </Link>
                  ) : (
                    <a
                      key={label}
                      href={href}
                      className="text-sm break-words text-footer-text hover:text-white"
                    >
                      {label}
                    </a>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 border-t border-footer-line pt-[18px] text-xs leading-[18px] text-footer-muted lg:flex-row lg:justify-between lg:pt-6 lg:text-[13px]">
          <span>
            © {year} {company.legalName || company.name}. All rights reserved.
          </span>
          <span>Secure payments by Razorpay · UPI, cards, netbanking</span>
        </div>
      </div>
    </footer>
  );
}
