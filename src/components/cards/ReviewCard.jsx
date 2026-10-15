import { initials } from '@/lib/text';
import { StarIcon } from './PackageCard';

const MAX_STARS = 5;

/** Rating stars (design kit): filled rust stars, outlined for the rest of five. */
export function Stars({ rating = 5, size = 20, className = '' }) {
  return (
    <div role="img" aria-label={`${rating} out of 5 stars`} className={`flex gap-1 ${className}`}>
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <StarIcon key={index} size={size} filled={index < rating} />
      ))}
    </div>
  );
}

/** Initials avatar on a Forest circle (design: traveller stories, blog author). */
export function Avatar({ name, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-2 font-display text-page lg:size-[52px] lg:text-xl ${className}`}
    >
      {initials(name)}
    </span>
  );
}

/** Traveller story (design: Main "traveller stories" sand card; Mobile-Home review). */
export function ReviewCard({ review }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col gap-4 rounded-3xl bg-sand p-[22px] lg:w-full lg:gap-5 lg:rounded-[28px] lg:p-8">
      <Stars rating={review.rating} />
      <blockquote className="font-display text-[19px] leading-[1.35] lg:text-[20px]">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 lg:gap-3.5">
        <Avatar name={review.name} />
        <span className="flex flex-col leading-[1.3]">
          <span className="font-bold">{review.name}</span>
          {review.tripLabel && <span className="text-[13px] text-muted lg:text-sm">{review.tripLabel}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
