import Image from 'next/image';
import { cn } from '@/lib/cn';
import { HillScene } from './HillScene';

/**
 * Cover-fit photo that fills its (positioned) parent. With no image yet it shows a lightweight
 * illustrated hill scene instead (`fallback` picks its mood: dawn, mist, sunset, forest, night).
 * `sizes` should describe the rendered width so Cloudinary serves the right size.
 * `priority` marks an above-the-fold (LCP) image: loaded eagerly with high fetch priority.
 */
export function Photo({ src, alt = '', sizes = '100vw', priority = false, fallback = 'dawn', className }) {
  if (!src) return <HillScene theme={fallback} className={className} />;
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
