import { Panel } from '@/components/ui/Panel';

/** Titled white panel used for each block of the booking detail page. */
export function DetailSection({ title, children, className }) {
  return (
    <Panel as="section" aria-label={title} className={className}>
      <h2 className="mb-4 text-lg font-bold lg:mb-5 lg:text-[20px]">{title}</h2>
      {children}
    </Panel>
  );
}

/** Label/value rows (trip facts, price breakdown). */
export function DetailRows({ rows }) {
  return (
    <dl className="flex flex-col divide-y divide-line">
      {rows.map(({ label, value, emphasis }) => (
        <div key={label} className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
          <dt className={emphasis ? 'text-[15px] font-bold' : 'text-sm text-muted lg:text-[15px]'}>
            {label}
          </dt>
          <dd
            className={
              emphasis
                ? 'text-right text-base font-extrabold lg:text-lg'
                : 'text-right text-sm font-semibold break-words lg:text-[15px]'
            }
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
