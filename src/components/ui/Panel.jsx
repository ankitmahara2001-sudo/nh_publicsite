import { cn } from '@/lib/cn';

/** White card on the page background (login, account pages): 20 px padding on phones, 32 px on desktop. */
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
