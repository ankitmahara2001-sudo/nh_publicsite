import { cn } from '@/lib/cn';

/** Paper card on the snow background (account pages, 404): 20 px padding on phones, 32 px on desktop. */
export function Panel({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag
      className={cn('rounded-[var(--radius-panel)] border border-line bg-surface p-5 lg:p-8', className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
