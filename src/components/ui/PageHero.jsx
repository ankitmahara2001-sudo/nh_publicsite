import { Header } from '@/components/layout/Header';
import { Breadcrumb } from './Breadcrumb';
import { Photo } from './Photo';

/**
 * Inner-page hero: photo with a dark overlay, transparent header on top, breadcrumb, H1 and subtitle
 * at the bottom left (Packages, Destinations, Offers, Gallery, Blog, About, Contact designs).
 * Fills the screen (`min-h-svh`: the small viewport height, so it does not jump when phone browser bars hide).
 */
export function PageHero({ title, subtitle, imageUrl, imageAlt = '', breadcrumb, active, children }) {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#1F3044] text-white">
      <Photo src={imageUrl} alt={imageAlt} priority sizes="100vw" className="-z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/55 via-navy/25 to-navy/75"
      />
      <Header variant="transparent" active={active} />
      <div className="mx-auto mt-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 pb-7 lg:gap-3.5 lg:px-20 lg:pb-16">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <h1 className="text-[32px] leading-9 font-extrabold tracking-[-0.8px] lg:text-[56px] lg:leading-[60px] lg:tracking-[-1.6px]">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-[760px] text-sm leading-[22px] text-white/80 lg:text-lg lg:leading-7">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
