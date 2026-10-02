import { cn } from '@/lib/cn';

/** Page gutter: 20 px on phones, 80 px on desktop, content max 1280 px (design frame 1440). */
export function Container({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1440px] px-5 lg:px-20', className)} {...props}>
      {children}
    </Tag>
  );
}

/** Vertical rhythm between home sections: 40 px mobile, 80 px desktop. */
export function Section({ className, children, ...props }) {
  return (
    <section className={cn('pt-10 lg:pt-20', className)} {...props}>
      {children}
    </section>
  );
}
