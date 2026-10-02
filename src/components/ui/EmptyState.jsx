import { cn } from '@/lib/cn';

/** Friendly message when a list has nothing to show yet, with an optional action (e.g. a link). */
export function EmptyState({ title, text, children, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-dashed border-input bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      <p className="text-lg font-extrabold">{title}</p>
      {text && <p className="max-w-[460px] text-[15px] leading-6 text-muted">{text}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
