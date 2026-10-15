import { Header } from '@/components/layout/Header';
import { Breadcrumb } from './Breadcrumb';
import { Photo } from './Photo';
import { Overline } from './SectionHeading';

/**
 * Inner-page hero under the Deodar header.
 * - `variant="banner"` (default): full-screen photo banner with the transparent header on top (as on
 *   the home page) and the breadcrumb, H1 and subtitle at the bottom left — Packages, Destinations,
 *   Offers, About, Contact.
 *   With no photo, `theme` picks the illustrated scene shown instead (see HillScene).
 * - `variant="plain"`: no photo; Kalam aside, big serif H1 and subtitle on Snow, with `aside`
 *   content on the right (design: Gallery and Blog boards).
 * `overline` is the short label above the title; `handwritten` shows it in the gallery's Kalam style.
 */
export function PageHero({
  title,
  subtitle,
  imageUrl,
  imageAlt = '',
  breadcrumb,
  active,
  overline,
  variant = 'banner',
  aside,
  handwritten = false,
  theme = 'dawn',
  children,
}) {
  if (variant === 'plain') {
    return (
      <>
        <Header variant="solid" active={active} />
        <section className="mx-auto flex w-full max-w-[1280px] flex-wrap items-end justify-between gap-6 px-5 pt-10 pb-6 lg:px-8 lg:pt-[70px] lg:pb-[30px]">
          <div className="flex max-w-[700px] flex-col gap-2">
            {breadcrumb && <Breadcrumb items={breadcrumb} light={false} className="mb-1" />}
            {overline && <Overline hand={handwritten}>{overline}</Overline>}
            <h1 className="text-[34px] leading-none lg:text-[clamp(34px,4.5vw,54px)]">{title}</h1>
            {subtitle && <p className="text-base text-muted lg:text-lg">{subtitle}</p>}
            {children}
          </div>
          {aside}
        </section>
      </>
    );
  }

  return (
    <>
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-navy-2 text-page">
        <Photo src={imageUrl} alt={imageAlt} priority sizes="100vw" fallback={theme} className="-z-10" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/55 via-navy/15 to-navy/80"
        />
        <Header variant="transparent" active={active} />
        <div className="mx-auto mt-auto flex w-full max-w-[1280px] flex-col gap-2.5 px-5 pt-16 pb-16 lg:gap-3 lg:px-8 lg:pt-10 lg:pb-24">
          {breadcrumb && <Breadcrumb items={breadcrumb} />}
          {overline && (
            <Overline light hand={handwritten}>
              {overline}
            </Overline>
          )}
          <h1 className="text-[30px] leading-[1.04] [text-shadow:0_2px_20px_rgba(0,0,0,.25)] lg:text-[clamp(30px,3.8vw,46px)] lg:leading-[1.02]">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-[760px] text-[15px] leading-6 text-page/85 lg:text-lg lg:leading-7">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {/* Ridge silhouette into the page, as on the home hero. */}
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 block h-10 w-full lg:h-16"
        >
          <path
            d="M0 60 L0 40 L80 22 L150 34 L240 8 L320 30 L420 14 L520 36 L610 18 L720 32 L820 6 L910 28 L1010 16 L1110 34 L1200 12 L1300 30 L1380 20 L1440 28 L1440 60 Z"
            fill="#f5f1e8"
          />
        </svg>
      </section>
    </>
  );
}
