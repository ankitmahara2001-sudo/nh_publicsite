import { initials } from '@/lib/text';

export function Stars({ rating = 5, className = '' }) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={`tracking-[2px] text-gold lg:tracking-[3px] ${className}`}
    >
      {'★'.repeat(rating)}
    </div>
  );
}

/** Testimonial (design/Main "What travellers say"; MobileHome uses the compact caption). */
export function ReviewCard({ review }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface p-[18px] lg:w-auto lg:gap-4 lg:p-[26px]">
      <Stars rating={review.rating} className="text-[15px]" />
      <blockquote className="text-sm leading-[22px] lg:text-base lg:leading-[26px]">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <span
          aria-hidden="true"
          className="hidden size-11 items-center justify-center rounded-full bg-sand text-sm font-extrabold text-gold-text lg:flex"
        >
          {initials(review.name)}
        </span>
        <span className="text-[13px] lg:flex lg:flex-col lg:text-[15px]">
          <span className="font-bold">{review.name}</span>
          {review.tripLabel && (
            <span className="text-muted lg:text-[13px]">
              <span className="lg:hidden"> · </span>
              {review.tripLabel}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
