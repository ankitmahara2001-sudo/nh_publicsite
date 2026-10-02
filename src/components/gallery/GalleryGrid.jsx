'use client';

import { useRef, useState } from 'react';
import { Photo } from '@/components/ui/Photo';
import { cn } from '@/lib/cn';
import { Lightbox } from './Lightbox';
import { tileSpanClasses } from './tileSpans';

/** Masonry-like photo grid (design/Gallery + MobileGallery). Each tile opens the lightbox. */
export function GalleryGrid({ photos }) {
  const [openIndex, setOpenIndex] = useState(null);
  const openerRef = useRef(null);

  const open = (index, event) => {
    openerRef.current = event.currentTarget;
    setOpenIndex(index);
  };

  const handleClose = () => {
    setOpenIndex(null);
    openerRef.current?.focus();
  };

  return (
    <>
      <ul className="grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-2.5 md:auto-rows-[180px] lg:grid-cols-4 lg:gap-4">
        {photos.map((photo, index) => (
          <li key={photo.id} className={cn('relative', tileSpanClasses(index))}>
            <button
              type="button"
              onClick={(event) => open(index, event)}
              aria-label={`Open photo: ${photo.caption ?? 'untitled'}`}
              className="group absolute inset-0 overflow-hidden rounded-xl text-left"
            >
              <Photo
                src={photo.url}
                alt=""
                sizes="(min-width: 1024px) 640px, 50vw"
                className="transition duration-500 group-hover:scale-[1.04]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent to-50%"
              />
              {photo.caption && (
                <span className="absolute right-2.5 bottom-2 left-2.5 text-xs font-semibold text-white lg:right-3.5 lg:bottom-3 lg:left-3.5 lg:text-[13px]">
                  {photo.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <Lightbox photos={photos} index={openIndex} onIndexChange={setOpenIndex} onClose={handleClose} />
      )}
    </>
  );
}
