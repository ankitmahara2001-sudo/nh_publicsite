import { TRIP_TYPE_LABELS } from '@/domain/enums';
import { formatDuration, formatRupees, priceUnitLabel } from '@/domain/format';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Pill } from '@/components/ui/Pill';

/** Package page hero (design/PackageDetail.dc.html, MobilePackageDetail.dc.html). */
export function PackageHero({ pkg }) {
  const place = pkg.destination?.district ?? pkg.destination?.name;
  const rating = pkg.reviewCount ? `★ ${pkg.rating.toFixed(1)}` : null;

  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#1B2B3A] text-white">
      <Photo src={pkg.coverImageUrl} alt="" priority sizes="100vw" className="-z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/55 via-navy/20 to-navy/85"
      />
      <Header variant="transparent" active="packages" />
      <div className="mx-auto mt-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 pb-6 lg:flex-row lg:items-end lg:justify-between lg:px-20 lg:pb-16">
        <div className="flex max-w-[760px] flex-col gap-2.5 lg:gap-3.5">
          <Link href="/packages" className="text-[13px] text-white/75 hover:underline lg:hidden">
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
          <div className="flex flex-wrap gap-1.5 lg:gap-2">
            {pkg.isFeatured && <Pill tone="gold">Featured</Pill>}
            <Pill tone="glass">{TRIP_TYPE_LABELS[pkg.tripType]}</Pill>
          </div>
          <h1 className="text-[30px] leading-[34px] font-extrabold tracking-[-0.8px] lg:text-[56px] lg:leading-[60px] lg:tracking-[-1.6px]">
            {pkg.title}
          </h1>
          <p className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/85 lg:text-base">
            <span>
              {place}
              <span className="hidden lg:inline">, Uttarakhand</span>
            </span>
            <span>{formatDuration(pkg.durationDays, pkg.durationNights)}</span>
            {rating && (
              <span>
                {rating} · {pkg.reviewCount} review{pkg.reviewCount === 1 ? '' : 's'}
              </span>
            )}
          </p>
        </div>
        {pkg.price && (
          <div className="hidden flex-col items-end gap-3.5 lg:flex">
            <div className="text-right">
              <div className="text-sm text-white/75">From</div>
              <div className="text-[36px] font-extrabold">
                {formatRupees(pkg.price.sellingPrice)}{' '}
                <span className="text-base font-medium text-white/70">
                  / {priceUnitLabel(pkg.price.priceType, pkg.price.label).replace('per ', '')}
                </span>
              </div>
              <div className="text-[13px] text-white/70">+ GST</div>
            </div>
            <div className="flex gap-2.5">
              <Button href="/contact" variant="outline-light">
                Enquire now
              </Button>
              <Button href="#book" variant="accent">
                Book this trip
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
