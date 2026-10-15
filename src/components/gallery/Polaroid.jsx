import { Photo } from '@/components/ui/Photo';
import { cn } from '@/lib/cn';

// Design kit "Polaroid · gallery & captions": white frame, washi tape on top, a slight tilt and a
// handwritten caption. Tilt and tape colour repeat along the list so neighbours differ.
const TILTS = ['-2.5deg', '1.8deg', '-1.2deg', '2deg', '-1.5deg', '1deg'];
const TAPES = ['rgba(226,137,43,.45)', 'rgba(184,54,74,.35)', 'rgba(76,107,79,.4)'];
const TAPE_TURNS = ['3deg', '-4deg', '2deg'];

/** Style for the element carrying the `polaroid` class (its tilt). */
export const polaroidTilt = (index) => ({ '--tilt': TILTS[index % TILTS.length] });

/**
 * Contents of a polaroid frame; the caller renders the frame element itself (a link or a button)
 * with `polaroidFrame` classes and `polaroidTilt(index)` as its style.
 */
export function PolaroidContent({
  photo,
  index,
  sizes,
  imageClassName = 'h-[170px] lg:h-[260px]',
  showPlace = false,
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 lg:h-[26px] lg:w-[90px]"
        style={{ background: TAPES[index % TAPES.length], rotate: TAPE_TURNS[index % TAPE_TURNS.length] }}
      />
      <span className={cn('relative block overflow-hidden bg-placeholder', imageClassName)}>
        <Photo src={photo.url} alt="" sizes={sizes} />
      </span>
      {photo.caption && (
        <span className="mt-2 block font-hand text-base leading-[1.3] text-ink lg:mt-3.5 lg:text-[19px]">
          {photo.caption}
        </span>
      )}
      {showPlace && photo.place && (
        <span className="mt-2 block text-xs font-bold tracking-[.14em] text-pine uppercase">
          {photo.place}
        </span>
      )}
    </>
  );
}

/** Classes of the polaroid frame element. */
export const polaroidFrame =
  'polaroid relative block bg-white p-2.5 pb-3.5 text-left shadow-[0_18px_40px_-22px_rgba(18,38,31,.55)] lg:p-3.5 lg:pb-5';
