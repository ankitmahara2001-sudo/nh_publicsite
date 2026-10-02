import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * Cover-fit photo that fills its (positioned) parent. Falls back to the navy placeholder block
 * from the design when there is no image yet.
 * `sizes` should describe the rendered width so Cloudinary serves the right size.
 * `priority` marks an above-the-fold (LCP) image: loaded eagerly with high fetch priority.
 */
export function Photo({ src, alt = '', sizes = '100vw', priority = false, className }) {
  if (!src) return <div aria-hidden="true" className={cn('absolute inset-0 bg-placeholder', className)} />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      className={cn('object-cover', className)}
    />
  );
}
