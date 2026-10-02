import { cn } from '@/lib/cn';
import { Panel } from './Panel';

/**
 * Page body with one centered white card on the page background
 * (login, 404, error and other pages without their own design).
 */
export function CenteredPage({ className, children, width = 'max-w-[480px]' }) {
  return (
    <main className="flex flex-1 items-start justify-center bg-page px-5 py-10 lg:items-center lg:py-20">
      <Panel className={cn('w-full', width, className)}>{children}</Panel>
    </main>
  );
}
