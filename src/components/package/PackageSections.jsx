import { formatDuration } from '@/domain/format';
import { Avatar, Stars } from '@/components/cards/ReviewCard';
import { Accordion } from '@/components/ui/Accordion';
import { Photo } from '@/components/ui/Photo';
import { Overline } from '@/components/ui/SectionHeading';

// Content sections of the package page (design: Package detail board), in page order.

function SectionTitle({ children, className = '' }) {
  return <h2 className={`text-[24px] leading-[1.1] lg:text-[30px] ${className}`}>{children}</h2>;
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2b5243"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9c2e3f"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function OverviewSection({ pkg, photoGrid }) {
  const groupSize =
    pkg.groupSizeMin && pkg.groupSizeMax
      ? `${pkg.groupSizeMin} – ${pkg.groupSizeMax} travellers`
      : pkg.groupSizeMax
        ? `Up to ${pkg.groupSizeMax} travellers`
        : null;
  const startEnd = pkg.fromCity === pkg.toCity ? pkg.fromCity : `${pkg.fromCity} → ${pkg.toCity}`;
  const facts = [
    ['Duration', formatDuration(pkg.durationDays, pkg.durationNights)],
    ['Start / end', startEnd],
    ['Group size', groupSize],
    ['Best time', pkg.bestTime],
    ['Stay', pkg.staySummary],
    ['Transport', pkg.transport],
  ].filter(([, value]) => value);

  return (
    <section id="overview" className="flex scroll-mt-20 flex-col gap-4">
      <Overline>the short of it</Overline>
      <h2 className="sr-only">Overview</h2>
      <p className="max-w-[680px] text-[17px] leading-[1.55] whitespace-pre-line text-ink lg:text-xl lg:leading-normal">
        {pkg.overview}
      </p>
      <dl className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4">
            <dt className="text-xs font-bold tracking-[.14em] text-pine uppercase">{label}</dt>
            <dd className="font-display text-lg leading-snug lg:text-xl">{value}</dd>
          </div>
        ))}
      </dl>
      {pkg.highlights.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {pkg.highlights.map((h) => (
            <li key={h.title} className="flex flex-col gap-1.5 rounded-2xl bg-sand p-4 lg:p-[18px]">
              <span className="font-display text-[17px] leading-tight">{h.title}</span>
              <span className="text-[13px] leading-[19px] text-muted">{h.text}</span>
            </li>
          ))}
        </ul>
      )}
      {photoGrid}
    </section>
  );
}

export function ItinerarySection({ itinerary }) {
  if (!itinerary.length) return null;
  return (
    <section id="itinerary" className="flex scroll-mt-20 flex-col gap-5">
      <SectionTitle>The trail, day by day</SectionTitle>
      <Accordion
        variant="itinerary"
        items={itinerary.map((day) => ({
          key: day.dayNumber,
          marker: String(day.dayNumber).padStart(2, '0'),
          header: (
            <span className="flex flex-col gap-0.5">
              <span className="text-xs font-bold tracking-[.16em] text-pine uppercase">
                Day {day.dayNumber}
              </span>
              <span className="font-display text-xl leading-tight lg:text-[21px]">{day.title}</span>
            </span>
          ),
          content: (
            <div className="flex flex-col gap-2.5 pt-1.5 pr-2 pl-[68px] lg:pl-[72px]">
              <p className="text-[15px] leading-6 whitespace-pre-line text-muted lg:text-base">
                {day.description}
              </p>
              {(day.meals || day.stay) && (
                <p className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] font-semibold text-pine lg:text-sm">
                  {day.meals && <span>Meals: {day.meals}</span>}
                  {day.stay && <span>Stay: {day.stay}</span>}
                </p>
              )}
            </div>
          ),
        }))}
      />
    </section>
  );
}

export function InclusionsSection({ included, excluded }) {
  if (!included.length && !excluded.length) return null;
  const list = (title, items, icon, boxClass) => (
    <div className={`flex flex-col gap-3 rounded-[20px] p-[22px] lg:p-6 ${boxClass}`}>
      <h3 className="text-[20px] leading-tight">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((text) => (
          <li key={text} className="flex gap-2.5 text-[15px] lg:text-base">
            {icon}
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <section id="inclusions" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="sr-only">What&apos;s included</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {included.length > 0 && list("What's included", included, <CheckIcon />, 'bg-success-bg')}
        {excluded.length > 0 && list('Not included', excluded, <CrossIcon />, 'bg-blush')}
      </div>
    </section>
  );
}

export function HotelsSection({ hotels }) {
  if (!hotels.length) return null;
  return (
    <section id="hotels" className="flex scroll-mt-20 flex-col gap-4 lg:gap-5">
      <SectionTitle>Where you&apos;ll stay</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {hotels.map((hotel) => (
          <article key={hotel.id} className="overflow-hidden rounded-[20px] border border-line bg-surface">
            <div className="relative h-[150px]">
              <Photo src={hotel.imageUrl} alt={hotel.name} sizes="(min-width: 1024px) 410px, 100vw" />
            </div>
            <div className="flex flex-col gap-1.5 p-4 lg:p-[18px]">
              <div className="flex justify-between gap-3">
                <h3 className="text-xl leading-tight">{hotel.name}</h3>
                {hotel.rating != null && (
                  <span className="shrink-0 text-sm font-bold">
                    <span aria-hidden="true">★</span> {hotel.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">
                {[hotel.roomType, hotel.nights && `${hotel.nights} night${hotel.nights === 1 ? '' : 's'}`]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {hotel.amenities && <p className="text-[13px] text-body">{hotel.amenities}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ReviewsSection({ reviews, rating, reviewCount }) {
  if (!reviews.length) return null;
  return (
    <section
      id="reviews"
      className="flex scroll-mt-20 flex-col gap-5 rounded-3xl bg-sand p-[22px] lg:gap-6 lg:p-[30px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <SectionTitle className="lg:text-[24px]">Traveller stories</SectionTitle>
        <span className="flex items-center gap-2.5">
          <Stars rating={Math.round(rating ?? 5)} size={18} />
          <span className="font-bold">
            {rating?.toFixed(1)}{' '}
            <span className="font-medium text-muted">
              · {reviewCount} review{reviewCount === 1 ? '' : 's'}
            </span>
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <figure key={review.id} className="flex flex-col gap-3">
            <blockquote className="text-[17px] leading-[1.6] font-medium text-ink lg:text-lg">
              “{review.text}”
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <Avatar name={review.name} />
              <span className="flex flex-col leading-[1.3]">
                <span className="font-bold">{review.name}</span>
                {review.tripLabel && <span className="text-[13px] text-muted">{review.tripLabel}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function FaqSection({ faqs }) {
  if (!faqs.length) return null;
  return (
    <section id="faq" className="flex scroll-mt-20 flex-col gap-2.5">
      <SectionTitle className="mb-1.5">Good to know</SectionTitle>
      <Accordion
        items={faqs.map((faq, index) => ({
          key: index,
          header: faq.question,
          content: (
            <p className="px-[18px] pb-4 text-[15px] leading-6 text-muted lg:px-[22px] lg:pb-[18px] lg:text-base">
              {faq.answer}
            </p>
          ),
        }))}
      />
    </section>
  );
}
