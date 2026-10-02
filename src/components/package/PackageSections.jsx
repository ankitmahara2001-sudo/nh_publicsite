import { formatDuration } from '@nh/shared';
import { Stars } from '@/components/cards/ReviewCard';
import { Accordion } from '@/components/ui/Accordion';
import { Photo } from '@/components/ui/Photo';

// Content sections of the package page (design/PackageDetail.dc.html), in page order.

function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={`text-[22px] font-extrabold tracking-[-0.6px] lg:text-[28px] ${className}`}>{children}</h2>
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
    <section id="overview" className="flex scroll-mt-20 flex-col gap-3.5 lg:gap-5">
      <SectionTitle>Overview</SectionTitle>
      <dl className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:gap-3">
        {facts.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-line bg-surface px-3.5 py-3 lg:px-[18px] lg:py-4"
          >
            <dt className="text-xs text-muted lg:text-[13px]">{label}</dt>
            <dd className="mt-0.5 text-sm font-bold lg:mt-1 lg:text-base">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[15px] leading-6 whitespace-pre-line text-body lg:text-[17px] lg:leading-7">
        {pkg.overview}
      </p>
      {pkg.highlights.length > 0 && (
        <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
          {pkg.highlights.map((h) => (
            <li key={h.title} className="flex flex-col gap-1.5 rounded-xl bg-sand p-4 lg:p-[18px]">
              <span className="text-[15px] font-bold">{h.title}</span>
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
    <section id="itinerary" className="flex scroll-mt-20 flex-col gap-3 lg:gap-4">
      <SectionTitle>Day-wise itinerary</SectionTitle>
      <Accordion
        variant="itinerary"
        items={itinerary.map((day) => ({
          key: day.dayNumber,
          header: (
            <span className="flex items-center gap-3 lg:gap-4">
              <span className="shrink-0 rounded-full bg-navy px-2.5 py-1 text-xs font-bold text-white lg:px-3 lg:text-[13px]">
                Day {day.dayNumber}
              </span>
              <span className="text-[15px] font-bold lg:text-[17px]">{day.title}</span>
            </span>
          ),
          content: (
            <div className="flex flex-col gap-2.5 px-3.5 pb-3.5 lg:pr-5 lg:pb-5 lg:pl-[100px]">
              <p className="text-sm leading-[22px] whitespace-pre-line text-body lg:text-[15px] lg:leading-6">
                {day.description}
              </p>
              {(day.meals || day.stay) && (
                <p className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] font-semibold text-navy lg:text-sm">
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
  const list = (title, items, mark, markClass) => (
    <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-4 lg:gap-3 lg:p-6">
      <h3 className="text-[15px] font-bold lg:text-[17px]">{title}</h3>
      <ul className="flex flex-col gap-2.5 lg:gap-3">
        {items.map((text) => (
          <li key={text} className="flex gap-2.5 text-sm lg:text-[15px]">
            <span aria-hidden="true" className={`font-extrabold ${markClass}`}>
              {mark}
            </span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <section id="inclusions" className="flex scroll-mt-20 flex-col gap-3 lg:gap-4">
      <SectionTitle>What&apos;s included</SectionTitle>
      <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
        {included.length > 0 && list('Included', included, '✓', 'text-success')}
        {excluded.length > 0 && list('Not included', excluded, '×', 'text-danger')}
      </div>
    </section>
  );
}

export function HotelsSection({ hotels }) {
  if (!hotels.length) return null;
  return (
    <section id="hotels" className="flex scroll-mt-20 flex-col gap-3 lg:gap-4">
      <SectionTitle>Where you&apos;ll stay</SectionTitle>
      <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
        {hotels.map((hotel) => (
          <article key={hotel.id} className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="relative h-[150px]">
              <Photo src={hotel.imageUrl} alt={hotel.name} sizes="(min-width: 1024px) 410px, 100vw" />
            </div>
            <div className="flex flex-col gap-1.5 p-4 lg:p-[18px]">
              <div className="flex justify-between gap-3">
                <h3 className="text-base font-bold">{hotel.name}</h3>
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
    <section id="reviews" className="flex scroll-mt-20 flex-col gap-3 lg:gap-4">
      <SectionTitle>Reviews</SectionTitle>
      <div className="flex flex-col gap-3 md:flex-row lg:gap-4">
        <div className="flex shrink-0 flex-col gap-1.5 rounded-xl bg-navy p-6 text-white md:w-[220px]">
          <span className="text-[44px] leading-none font-extrabold">{rating?.toFixed(1)}</span>
          <Stars rating={Math.round(rating ?? 5)} className="text-gold-light" />
          <span className="text-sm text-footer-text">
            Based on {reviewCount} review{reviewCount === 1 ? '' : 's'}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="flex flex-col gap-2 rounded-xl border border-line bg-surface px-5 py-[18px]"
            >
              <figcaption className="flex justify-between gap-3">
                <span className="font-bold">{review.name}</span>
                <span className="text-[13px] text-muted">{review.tripLabel}</span>
              </figcaption>
              <blockquote className="text-[15px] leading-6 text-body">{review.text}</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ faqs }) {
  if (!faqs.length) return null;
  return (
    <section id="faq" className="flex scroll-mt-20 flex-col gap-2.5 lg:gap-3">
      <SectionTitle className="mb-1">Frequently asked questions</SectionTitle>
      <Accordion
        items={faqs.map((faq, index) => ({
          key: index,
          header: <span className="text-[15px] font-bold lg:text-base">{faq.question}</span>,
          content: (
            <p className="px-3.5 pb-3.5 text-sm leading-[22px] text-body lg:px-5 lg:pb-[18px] lg:text-[15px] lg:leading-6">
              {faq.answer}
            </p>
          ),
        }))}
      />
    </section>
  );
}
