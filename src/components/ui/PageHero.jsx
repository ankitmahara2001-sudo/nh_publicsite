import { Header } from '@/components/layout/Header';
import { Breadcrumb } from './Breadcrumb';
import { Photo } from './Photo';
import { Overline } from './SectionHeading';

/**
 * Inner-page hero under the Deodar header.
 * - `variant="banner"` (default): photo banner with the breadcrumb, serif H1 and subtitle at the
 *   bottom left (design: Package detail banner) — Packages, Destinations, Offers, About, Contact.
 * - `variant="plain"`: no photo; Kalam aside, big serif H1 and subtitle on Snow, with `aside`
 *   content on the right (design: Gallery and Blog boards).
 * `overline` is the short handwritten aside above the title.
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
  children,
}) {
  if (variant === 'plain') {
    return (
      <>
        <Header variant="solid" active={active} />
        <section className="mx-auto flex w-full max-w-[1280px] flex-wrap items-end justify-between gap-6 px-5 pt-10 pb-6 lg:px-8 lg:pt-[70px] lg:pb-[30px]">
          <div className="flex max-w-[700px] flex-col gap-2">
            {breadcrumb && <Breadcrumb items={breadcrumb} light={false} className="mb-1" />}
            {overline && <Overline>{overline}</Overline>}
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
      <Header variant="solid" active={active} />
      <section className="relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden bg-navy-2 text-page lg:min-h-[460px]">
        <Photo src={imageUrl} alt={imageAlt} priority sizes="100vw" className="-z-10" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/10 via-navy/25 to-navy/80"
        />
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2.5 px-5 pt-16 pb-7 lg:gap-3 lg:px-8 lg:pt-10 lg:pb-9">
          {breadcrumb && <Breadcrumb items={breadcrumb} />}
          {overline && <Overline light>{overline}</Overline>}
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
      </section>
    </>
  );
}
