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
      <Header variant="solid" active="packages" />
      <section className="relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden bg-navy-2 text-page lg:min-h-[460px]">
        <Photo src={pkg.coverImageUrl} alt="" priority sizes="100vw" className="-z-10" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/5 via-navy/20 to-navy/80"
        />
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 px-5 pt-16 pb-7 lg:px-8 lg:pt-10 lg:pb-9">
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
      </section>
    </>
  );
}
