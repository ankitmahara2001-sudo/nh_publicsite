import { TRIP_TYPE_LABELS } from '@/domain/enums';
import { formatDuration } from '@/domain/format';
import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { Pill } from '@/components/ui/Pill';
import { PriceTag } from '@/components/ui/PriceTag';
import { ArrowIcon } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';

/** Badge shown on the photo: Featured, else "12% off", else the trip type. */
function cardBadge(pkg, preferTripType) {
  if (preferTripType) return TRIP_TYPE_LABELS[pkg.tripType];
  if (pkg.isFeatured) return 'Featured';
  if (pkg.price?.savingPercent) return `${pkg.price.savingPercent}% off`;
  return TRIP_TYPE_LABELS[pkg.tripType];
}

/** Badge colour (design kit): Buransh for Featured, Marigold for a discount, paper for the trip type. */
function badgeTone(pkg, preferTripType) {
  if (preferTripType) return 'white';
  if (pkg.isFeatured) return 'buransh';
  if (pkg.price?.savingPercent) return 'gold';
  return 'white';
}

export function StarIcon({ size = 14, filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"
        fill={filled ? '#c46a1c' : 'none'}
        stroke="#c46a1c"
        strokeWidth={filled ? 0 : 1.6}
      />
    </svg>
  );
}

function Rating({ rating, reviewCount }) {
  if (!reviewCount) return null;
  return (
    <Pill tone="white" size="md" className="absolute top-3 right-3 lg:top-3.5 lg:right-3.5">
      <StarIcon />
      {rating.toFixed(1)}
      <span className="sr-only"> out of 5 from</span>
      <span>
        {' '}
        · {reviewCount} review{reviewCount === 1 ? '' : 's'}
      </span>
    </Pill>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/**
 * The perforated line of a ticket: a dashed rule with a half-circle notch cut into each side.
 * `notch` is the background colour behind the card.
 */
export function TicketDivider({ notch = 'bg-page', className }) {
  return (
    <div aria-hidden="true" className={cn('relative flex h-[18px] items-center lg:h-[22px]', className)}>
      <span
        className={cn(
          'absolute -left-[9px] size-[18px] rounded-full border border-line lg:-left-[11px] lg:size-[22px]',
          notch,
        )}
      />
      <span className="mx-4 flex-1 border-t-2 border-dashed border-dash lg:mx-5" />
      <span
        className={cn(
          'absolute -right-[9px] size-[18px] rounded-full border border-line lg:-right-[11px] lg:size-[22px]',
          notch,
        )}
      />
    </div>
  );
}

/**
 * Ticket-style package card (design: Main "Handpicked journeys" = variant "home", Packages grid =
 * variant "list"). The whole card links to the package; the button is a visual call to action.
 */
export function PackageCard({ pkg, variant = 'list', priority = false }) {
  const home = variant === 'home';
  const href = `/packages/${pkg.slug}`;
  const duration = formatDuration(pkg.durationDays, pkg.durationNights);
  const highlights = home ? pkg.highlightTitles : pkg.highlightTitles.slice(0, 2);

  return (
    <article className="lift group relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface lg:rounded-3xl">
      <div className={cn('relative overflow-hidden', home ? 'h-[180px] lg:h-60' : 'h-[180px] lg:h-[210px]')}>
        <Photo
          src={pkg.coverImageUrl}
          alt=""
          priority={priority}
          sizes="(min-width: 1024px) 420px, 100vw"
          className="transition duration-500 group-hover:scale-[1.03]"
        />
        <Pill tone={badgeTone(pkg, !home)} className="absolute top-3 left-3 lg:top-3.5 lg:left-3.5">
          {cardBadge(pkg, !home)}
        </Pill>
        <Rating rating={pkg.rating} reviewCount={pkg.reviewCount} />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-[18px] pt-4 pb-3 lg:gap-2.5 lg:px-6 lg:pt-[22px] lg:pb-[18px]">
        <div className="flex flex-wrap gap-2 text-[13px] font-semibold">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-sand px-2.5 py-[5px]">
            <ClockIcon />
            {duration}
          </span>
          {pkg.destination?.district && (
            <span className="inline-flex items-center rounded-lg bg-sand px-2.5 py-[5px]">
              {pkg.destination.district}
            </span>
          )}
        </div>
        <h3
          className={cn('leading-[1.15]', home ? 'text-[20px] lg:text-[22px]' : 'text-[20px] lg:text-[21px]')}
        >
          <Link href={href} className="after:absolute after:inset-0 hover:text-gold-text">
            {pkg.title}
          </Link>
        </h3>
        {highlights.length > 0 && (
          <p className="text-[15px] leading-6 text-muted">{highlights.join(' · ')}</p>
        )}
      </div>
      <TicketDivider />
      <div className="flex flex-wrap items-end justify-between gap-3 px-[18px] pt-2.5 pb-[18px] lg:px-6 lg:pt-3.5 lg:pb-[22px]">
        <PriceTag price={pkg.price} size={home ? 'lg' : 'md'} showFrom={home} />
        <span
          aria-hidden="true"
          className={buttonClasses({
            size: 'custom',
            className: 'h-11 px-5 text-[15px] group-hover:bg-navy-2',
          })}
        >
          View trip
          <ArrowIcon size={16} />
        </span>
      </div>
    </article>
  );
}
