import { cn } from '@/lib/cn';

/** Page gutter: 20 px on phones, 32 px on desktop, frame max 1280 px (design boards). */
export function Container({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1280px] px-5 lg:px-8', className)} {...props}>
      {children}
    </Tag>
  );
}

/** Vertical rhythm between home sections: 48 px mobile, 100 px desktop. */
export function Section({ className, children, ...props }) {
  return (
    <section className={cn('pt-12 lg:pt-[100px]', className)} {...props}>
      {children}
    </section>
  );
}
