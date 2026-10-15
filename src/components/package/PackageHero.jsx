import { TRIP_TYPE_LABELS } from '@/domain/enums';
import { formatDuration } from '@/domain/format';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Photo } from '@/components/ui/Photo';
import { Pill } from '@/components/ui/Pill';

/** Package page banner under the Deodar header (design: Package detail board). */
export function PackageHero({ pkg }) {
  const place = pkg.destination?.district ?? pkg.destination?.name;
  const rating = pkg.reviewCount ? `★ ${pkg.rating.toFixed(1)}` : null;

  return (
    <>
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-navy-2 text-page">
        <Photo src={pkg.coverImageUrl} alt="" priority sizes="100vw" fallback="dawn" className="-z-10" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/55 via-navy/15 to-navy/80"
        />
        <Header variant="transparent" active="packages" />
        <div className="mx-auto mt-auto flex w-full max-w-[1280px] flex-col gap-3 px-5 pt-16 pb-16 lg:px-8 lg:pt-10 lg:pb-24">
          <Link href="/packages" className="text-sm text-page/85 hover:underline lg:hidden">
            ← Packages
          </Link>
          <Breadcrumb
            className="hidden lg:block"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Packages', href: '/packages' },
              { label: pkg.title },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            {pkg.isFeatured && <Pill tone="buransh">Featured</Pill>}
            <Pill tone="glass" size="md">
              {TRIP_TYPE_LABELS[pkg.tripType]}
            </Pill>
            <Pill tone="glass" size="md">
              {formatDuration(pkg.durationDays, pkg.durationNights)}
            </Pill>
            {rating && (
              <Pill tone="glass" size="md">
                {rating} · {pkg.reviewCount} review{pkg.reviewCount === 1 ? '' : 's'}
              </Pill>
            )}
          </div>
          <h1 className="max-w-[900px] text-[28px] leading-[1.05] [text-shadow:0_2px_20px_rgba(0,0,0,.25)] lg:text-[clamp(30px,3.8vw,46px)] lg:leading-[1.02]">
            {pkg.title}
          </h1>
          {place && (
            <p className="text-[15px] text-page/90 lg:text-base">
              {place}
              <span className="hidden lg:inline">, Uttarakhand</span>
            </p>
          )}
        </div>
        {/* Ridge silhouette into the page, as on the home hero. */}
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 block h-10 w-full lg:h-16"
        >
          <path
            d="M0 60 L0 40 L80 22 L150 34 L240 8 L320 30 L420 14 L520 36 L610 18 L720 32 L820 6 L910 28 L1010 16 L1110 34 L1200 12 L1300 30 L1380 20 L1440 28 L1440 60 Z"
            fill="#f5f1e8"
          />
        </svg>
      </section>
    </>
  );
}
