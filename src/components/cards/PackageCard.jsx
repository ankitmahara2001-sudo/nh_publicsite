import { TRIP_TYPE_LABELS, formatDuration } from '@nh/shared';
import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Pill } from '@/components/ui/Pill';
import { PriceTag } from '@/components/ui/PriceTag';
import { cn } from '@/lib/cn';

/** Badge shown on the photo: Featured, else "12% off", else the trip type. */
function cardBadge(pkg, preferTripType) {
  if (preferTripType) return TRIP_TYPE_LABELS[pkg.tripType];
  if (pkg.isFeatured) return 'Featured';
  if (pkg.price?.savingPercent) return `${pkg.price.savingPercent}% off`;
  return TRIP_TYPE_LABELS[pkg.tripType];
}

export function Rating({ rating, reviewCount }) {
  if (!reviewCount) return null;
  return (
    <span className="font-bold text-ink">
      <span aria-hidden="true">★</span> {rating.toFixed(1)}
      <span className="sr-only"> out of 5 from</span>{' '}
      <span className="font-normal text-muted">({reviewCount})</span>
    </span>
  );
}

/**
 * Package card (design: Main "Popular trips" = variant "home", Packages grid = variant "list").
 * The whole card links to the package; the button is a visual call to action.
 */
export function PackageCard({ pkg, variant = 'list', priority = false }) {
  const home = variant === 'home';
  const href = `/packages/${pkg.slug}`;
  const duration = formatDuration(pkg.durationDays, pkg.durationNights);
  const shortDuration = `${pkg.durationDays}D / ${pkg.durationNights}N`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <div className={cn('relative', home ? 'h-[180px] lg:h-[220px]' : 'h-40 lg:h-[190px]')}>
        <Photo
          src={pkg.coverImageUrl}
          alt=""
          priority={priority}
          sizes="(min-width: 1024px) 400px, 100vw"
          className="transition duration-500 group-hover:scale-[1.03]"
        />
        <Pill className="absolute top-3 left-3 lg:top-4 lg:left-4">{cardBadge(pkg, !home)}</Pill>
      </div>
      <div
        className={cn(
          'flex flex-1 flex-col gap-1.5',
          home ? 'p-4 lg:gap-2.5 lg:p-[22px]' : 'p-4 lg:gap-2 lg:p-[18px]',
        )}
      >
        <div className="flex justify-between gap-3 text-[13px] text-muted lg:text-sm">
          <span>
            {pkg.destination?.district}
            <span className="lg:hidden"> · {shortDuration}</span>
          </span>
          <Rating rating={pkg.rating} reviewCount={pkg.reviewCount} />
        </div>
        <h3
          className={cn(
            'font-bold',
            home ? 'text-[17px] leading-6 lg:text-[19px] lg:leading-[26px]' : 'text-[17px] leading-6',
          )}
        >
          <Link href={href} className="after:absolute after:inset-0 hover:text-gold-text">
            {pkg.title}
          </Link>
        </h3>
        <p className="hidden text-[13px] text-muted lg:block lg:text-sm">
          {duration}
          {home && pkg.highlightTitles.length > 0 && ` · ${pkg.highlightTitles.join(' · ')}`}
        </p>
        {!home && pkg.highlightTitles.length > 0 && (
          <p className="hidden text-[13px] lg:block">{pkg.highlightTitles.slice(0, 2).join(' · ')}</p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-2.5 lg:pt-3">
          <PriceTag price={pkg.price} size={home ? 'lg' : 'md'} showFrom={home} />
          <span aria-hidden="true" className={buttonClasses({ size: 'sm' })}>
            {home ? <span className="lg:hidden">View</span> : 'View'}
            {home && <span className="hidden lg:inline">View package</span>}
          </span>
        </div>
      </div>
    </article>
  );
}
