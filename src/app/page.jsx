import Link from 'next/link';
import { BlogCard } from '@/components/cards/BlogCard';
import { OfferTeaserCard } from '@/components/cards/OfferCard';
import { PackageCard } from '@/components/cards/PackageCard';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { HeroSlider } from '@/components/home/HeroSlider';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { Photo } from '@/components/ui/Photo';
import { Overline, SectionHeading } from '@/components/ui/SectionHeading';
import { getApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { getSiteSettings } from '@/lib/server';

export const revalidate = 60;

/** Horizontal scroller on phones, grid on desktop (design/MobileHome carousels). */
function Scroller({ className, children }) {
  return (
    <div
      className={cn(
        'no-scrollbar relative -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

function DestinationTile({ destination }) {
  return (
    <Link
      href={`/packages?destination=${destination.slug}`}
      className="group relative flex h-[280px] w-[220px] shrink-0 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-4 text-white lg:h-80 lg:w-auto lg:p-[22px]"
    >
      <Photo
        src={destination.coverImageUrl}
        alt=""
        sizes="(min-width: 1024px) 300px, 220px"
        className="-z-10 transition duration-500 group-hover:scale-[1.04]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
      />
      <span className="text-[11px] font-bold tracking-[1.6px] text-white/75 uppercase lg:text-xs lg:tracking-[1.8px]">
        {destination.district}
      </span>
      <span className="text-xl font-extrabold lg:mt-1 lg:text-2xl">{destination.name}</span>
      <span className="text-[13px] text-white/80 lg:mt-1.5 lg:text-sm">
        {destination.packageCount} {destination.packageCount === 1 ? 'package' : 'packages'}{' '}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

const GALLERY_TILE_CLASSES = [
  'row-span-2 lg:col-span-2 lg:row-span-2',
  '',
  '',
  'hidden lg:block',
  'hidden lg:block',
];

export default async function HomePage() {
  const [{ data: home }, settings] = await Promise.all([getApi('/home'), getSiteSettings()]);
  const t = settings.home;

  return (
    <main>
      <HeroSlider slides={home.slides}>
        <Header variant="transparent" active="home" />
        <Container className="relative z-10 mt-auto mb-[150px] flex flex-col gap-3.5 text-white lg:mb-24 lg:gap-[22px]">
          <Overline light>{t.hero.overline}</Overline>
          <h1 className="max-w-[700px] text-4xl leading-10 font-extrabold tracking-[-1px] lg:text-[64px] lg:leading-[68px] lg:tracking-[-2px]">
            {t.hero.heading}
          </h1>
          <p className="max-w-[560px] text-[15px] leading-[23px] text-white/82 lg:text-lg lg:leading-7">
            {t.hero.subheading}
          </p>
          <div className="flex gap-3 lg:pt-1.5">
            <Button href="/packages" variant="accent" size="lg">
              {t.hero.primaryCtaLabel}
            </Button>
            <span className="hidden lg:block">
              <Button href="/contact" variant="outline-light" size="lg">
                {t.hero.secondaryCtaLabel}
              </Button>
            </span>
          </div>
        </Container>
      </HeroSlider>

      {home.destinations.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-[18px] lg:gap-8">
            <SectionHeading
              overline={t.destinations.overline}
              title={t.destinations.title}
              linkLabel={t.destinations.linkLabel}
              href="/destinations"
            />
            <Scroller className="lg:grid-cols-4 lg:gap-6">
              {home.destinations.map((destination) => (
                <DestinationTile key={destination.id} destination={destination} />
              ))}
            </Scroller>
          </Container>
        </Section>
      )}

      {home.packages.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-[18px] lg:gap-8">
            <SectionHeading
              overline={t.packages.overline}
              title={t.packages.title}
              linkLabel={t.packages.linkLabel}
              href="/packages"
            />
            <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {home.packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} variant="home" />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {home.offers.length > 0 && (
        <section className="mt-10 bg-sand py-8 lg:mt-20 lg:py-16">
          <Container className="flex flex-col gap-4 lg:gap-7">
            <SectionHeading
              overline={t.offers.overline}
              title={t.offers.title}
              linkLabel={t.offers.linkLabel}
              href="/offers"
            />
            <Scroller className="lg:grid-cols-3 lg:gap-6">
              {home.offers.map((offer) => (
                <OfferTeaserCard key={offer.id} offer={offer} />
              ))}
            </Scroller>
          </Container>
        </section>
      )}

      {home.gallery.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-4 lg:gap-8">
            <SectionHeading
              overline={t.gallery.overline}
              title={t.gallery.title}
              linkLabel={t.gallery.linkLabel}
              href="/gallery"
            />
            <div className="grid auto-rows-[150px] grid-cols-2 gap-2.5 lg:auto-rows-[200px] lg:grid-cols-4 lg:gap-4">
              {home.gallery.map((photo, index) => (
                <Link
                  key={photo.id}
                  href="/gallery"
                  className={cn('group relative overflow-hidden rounded-xl', GALLERY_TILE_CLASSES[index])}
                >
                  <Photo
                    src={photo.url}
                    alt={photo.caption ?? ''}
                    sizes="(min-width: 1024px) 640px, 50vw"
                    className="transition duration-500 group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"
                  />
                  {photo.caption && (
                    <span className="absolute bottom-3 left-3.5 text-[13px] font-semibold text-white">
                      {photo.caption}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:gap-16">
          <div className="relative h-[220px] shrink-0 overflow-hidden rounded-[var(--radius-card)] lg:h-[420px] lg:w-[600px]">
            <Photo src={t.about.imageUrl} alt="" sizes="(min-width: 1024px) 600px, 100vw" />
          </div>
          <div className="flex flex-col gap-3.5 lg:gap-[18px]">
            <Overline>{t.about.overline}</Overline>
            <h2 className="text-2xl leading-[30px] font-extrabold tracking-[-0.5px] lg:text-[36px] lg:leading-[44px] lg:tracking-[-1px]">
              {t.about.title}
            </h2>
            <p className="text-[15px] leading-6 text-muted lg:text-[17px] lg:leading-7">{t.about.subtitle}</p>
            {t.about.stats.length > 0 && (
              <dl className="hidden gap-10 py-2 lg:flex">
                {t.about.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse">
                    <dt className="text-sm text-muted">{stat.label}</dt>
                    <dd className="text-[28px] font-extrabold">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Link href="/about" className="text-sm font-bold text-navy hover:text-gold-text lg:text-[15px]">
              {t.about.linkLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Container>
      </Section>

      {home.reviews.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-4 lg:gap-8">
            <SectionHeading overline={t.testimonials.overline} title={t.testimonials.title} />
            <Scroller className="lg:grid-cols-3 lg:gap-6">
              {home.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </Scroller>
          </Container>
        </Section>
      )}

      {home.posts.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-3.5 lg:gap-8">
            <SectionHeading
              overline={t.blog.overline}
              title={t.blog.title}
              linkLabel={t.blog.linkLabel}
              href="/blog"
            />
            <div className="flex flex-col gap-3.5 lg:grid lg:grid-cols-3 lg:gap-8">
              {home.posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Container as="section" className="py-10 lg:py-20">
        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-navy p-6 text-white lg:flex-row lg:items-center lg:justify-between lg:rounded-[var(--radius-panel)] lg:px-14 lg:py-11">
          <div className="flex flex-col gap-2">
            <h2 className="text-[22px] font-extrabold lg:text-[30px] lg:leading-[38px]">
              {t.ctaBanner.title}
            </h2>
            <p className="text-sm leading-[22px] text-footer-text lg:text-base">{t.ctaBanner.text}</p>
          </div>
          <Button href="/contact" variant="accent" size="lg" className="w-full lg:w-auto">
            {t.ctaBanner.buttonLabel}
          </Button>
        </div>
      </Container>
    </main>
  );
}
