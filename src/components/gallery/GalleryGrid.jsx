'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Lightbox } from './Lightbox';
import { PolaroidContent, polaroidFrame, polaroidTilt } from './Polaroid';

/** Polaroid postcards (design: Gallery board — "Tap a postcard to see it large"). Each one opens the lightbox. */
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
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 px-1 sm:grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] sm:gap-x-9 sm:gap-y-11 lg:px-2">
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={(event) => open(index, event)}
              aria-label={`Open photo: ${photo.caption ?? 'untitled'}`}
              style={polaroidTilt(index)}
              className={cn(polaroidFrame, 'w-full cursor-pointer')}
            >
              <PolaroidContent
                photo={photo}
                index={index}
                showPlace
                sizes="(min-width: 1024px) 400px, 50vw"
                imageClassName="h-[150px] sm:h-[280px]"
              />
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
