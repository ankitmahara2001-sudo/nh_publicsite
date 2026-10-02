'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Lightbox } from '@/components/gallery/Lightbox';
import { cn } from '@/lib/cn';

const GRID_PHOTOS = 4; // big photo + 3 small; the 5th tile is "+N photos"
const STRIP_PHOTOS = 3;

/**
 * Package photos: grid on desktop (design/PackageDetail), thumbnail strip on phones
 * (design/MobilePackageDetail). Any photo or the "+N photos" tile opens the lightbox.
 */
export function PackagePhotos({ title, images }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!images.length) return null;

  const photos = images.map((image) => ({ id: image.id, url: image.url, caption: image.altText || title }));
  const extra = (count) => images.length - count;

  const tile = (photo, index, className, sizes) => (
    <button
      key={photo.id}
      type="button"
      onClick={() => setOpenIndex(index)}
      aria-label={`Open photo: ${photo.caption}`}
      className={cn('group relative overflow-hidden rounded-xl bg-placeholder', className)}
    >
      <Image
        src={photo.url}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition duration-500 group-hover:scale-[1.04]"
      />
    </button>
  );

  const moreTile = (count, className) =>
    count > 0 && (
      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        className={cn(
          'flex items-center justify-center rounded-xl bg-[#3B4656] font-bold text-white hover:bg-navy-2',
          className,
        )}
      >
        +{count} photos
      </button>
    );

  return (
    <>
      <div className="hidden auto-rows-[150px] grid-cols-[2fr_1fr_1fr] gap-3 lg:grid">
        {photos
          .slice(0, GRID_PHOTOS)
          .map((photo, index) =>
            tile(photo, index, index === 0 ? 'row-span-2' : '', index === 0 ? '420px' : '210px'),
          )}
        {moreTile(extra(GRID_PHOTOS), 'text-[15px]')}
      </div>
      <div className="no-scrollbar relative -mx-5 flex gap-2 overflow-x-auto px-5 lg:hidden">
        {photos
          .slice(0, STRIP_PHOTOS)
          .map((photo, index) => tile(photo, index, 'h-[84px] w-[120px] shrink-0 rounded-[10px]', '120px'))}
        {moreTile(extra(STRIP_PHOTOS), 'h-[84px] w-[120px] shrink-0 rounded-[10px] text-sm')}
      </div>
      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
