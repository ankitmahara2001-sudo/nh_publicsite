import Link from 'next/link';
import { BlogCard } from '@/components/cards/BlogCard';
import { OfferTeaserCard, offerTone } from '@/components/cards/OfferCard';
import { PackageCard } from '@/components/cards/PackageCard';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { PolaroidContent, polaroidFrame, polaroidTilt } from '@/components/gallery/Polaroid';
import { HeroSlider } from '@/components/home/HeroSlider';
import { MobileTabBar } from '@/components/home/MobileTabBar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { Photo } from '@/components/ui/Photo';
import { ArrowIcon, Eyebrow, Overline, SectionHeading } from '@/components/ui/SectionHeading';
import { getApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { getSiteSettings } from '@/lib/server';
import { enquiryHref } from '@/lib/enquiry';

export const revalidate = 60;

// Handwritten asides from the design, used when a section has no overline in the site settings.
const ASIDES = {
  destinations: 'pick a valley',
  packages: 'tickets to the hills',
  offers: 'a little something for the road',
  gallery: "from our travellers' cameras",
  testimonials: 'traveller stories',
  blog: 'field notes',
};

/** Horizontal scroller on phones, grid on desktop (design: Mobile-Home carousels). */
function Scroller({ className, children }) {
  return (
    <div
      className={cn(
        'no-scrollbar relative -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pt-1 pb-2.5 lg:mx-0 lg:grid lg:snap-none lg:overflow-visible lg:px-0 lg:pt-0 lg:pb-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Destination: photo tile with overlaid name on phones, paper card on desktop (design: "Where the hills call"). */
function DestinationTile({ destination }) {
  return (
    <Link
      href={`/packages?destination=${destination.slug}`}
      className="lift group relative flex h-[270px] w-[220px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[20px] bg-navy-2 text-page lg:h-auto lg:w-auto lg:justify-start lg:rounded-[22px] lg:border lg:border-line lg:bg-surface lg:text-ink"
    >
      <div className="absolute inset-0 overflow-hidden lg:relative lg:h-[230px]">
        <Photo
          src={destination.coverImageUrl}
          alt=""
          sizes="(min-width: 1024px) 300px, 220px"
          className="transition duration-500 group-hover:scale-[1.04]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent lg:hidden"
        />
      </div>
      <div className="relative flex flex-col gap-0.5 p-4 lg:gap-1.5 lg:px-[22px] lg:pt-5 lg:pb-[22px]">
        <span className="text-xs font-bold tracking-[.16em] text-gold-light uppercase lg:text-pine">
          {destination.district}
        </span>
        <span className="font-display text-[21px] leading-[1.1] lg:text-[22px]">{destination.name}</span>
        <span className="flex items-center justify-between text-sm font-semibold text-gold-light lg:mt-1.5 lg:text-base lg:text-gold-text">
          {destination.packageCount} {destination.packageCount === 1 ? 'package' : 'packages'}
          <ArrowIcon size={22} className="hidden text-ink lg:block" />
        </span>
      </div>
    </Link>
  );
}

/** "Build a custom trip" card at the end of the packages grid (design: Main packages). */
function CustomTripCard({ email }) {
  return (
    <article className="contour-bg relative flex min-h-[320px] flex-col justify-between gap-8 overflow-hidden rounded-[22px] bg-navy-2 p-7 text-page lg:min-h-[420px] lg:rounded-3xl lg:p-8">
      <div className="flex flex-col gap-3">
        <Overline light dash={false}>
          apni yatra, apne hisaab se
        </Overline>
        <h3 className="text-[24px] leading-[1.1] lg:text-[26px]">Build a custom trip</h3>
        <p className="text-footer-text">
          Tell us your dates, group and pace. We&apos;ll draw the route across Kumaon and Garhwal for you.
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        <Button href={enquiryHref()} variant="accent" size="lg" block>
          Send a travel enquiry
        </Button>
        {email && (
          <a href={`mailto:${email}`} className="text-center text-sm text-page underline">
            or write to {email}
          </a>
        )}
      </div>
    </article>
  );
}

export default async function HomePage() {
  const [{ data: home }, settings] = await Promise.all([getApi('/home'), getSiteSettings()]);
  const t = settings.home;
  const { company } = settings;

  return (
    <main>
      <HeroSlider slides={home.slides}>
        <Header variant="transparent" active="home" />
        <Container className="relative z-10 mt-auto mb-[150px] flex flex-col gap-3 text-page lg:mb-[210px] lg:gap-[18px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span lang="hi" className="font-hand text-xl text-gold-light lg:text-[21px]">
              देवभूमि उत्तराखंड
            </span>
            <span aria-hidden="true" className="h-px w-9 bg-page/50" />
            <span className="text-xs font-bold tracking-[.22em] uppercase lg:text-[13px]">
              {t.hero.overline}
            </span>
          </div>
          <h1 className="max-w-[760px] text-[36px] leading-none tracking-[-.02em] text-balance lg:text-[clamp(40px,5vw,64px)] lg:leading-[.98]">
            {t.hero.heading}
          </h1>
          <p className="max-w-[520px] text-base text-page/90 lg:text-[19px]">{t.hero.subheading}</p>
          <div className="mt-1.5 flex gap-2.5 lg:gap-3">
            <Button
              href="/packages"
              variant="accent"
              size="lg"
              className="shadow-[0_12px_26px_-14px_rgba(140,70,10,.8)]"
            >
              {t.hero.primaryCtaLabel}
              <ArrowIcon />
            </Button>
            <Button
              href={enquiryHref()}
              variant="ghost"
              size="lg"
              className="border border-navy/35 bg-page/80 backdrop-blur-sm"
            >
              {t.hero.secondaryCtaLabel}
            </Button>
          </div>
        </Container>
      </HeroSlider>

      {home.destinations.length > 0 && (
        <Section id="destinations">
          <Container className="flex flex-col gap-4 lg:gap-10">
            <SectionHeading
              overline={t.destinations.overline || ASIDES.destinations}
              title={t.destinations.title}
              linkLabel={t.destinations.linkLabel}
              href="/destinations"
            />
            <Scroller className="lg:grid-cols-4 lg:gap-[22px]">
              {home.destinations.map((destination) => (
                <DestinationTile key={destination.id} destination={destination} />
              ))}
            </Scroller>
          </Container>
        </Section>
      )}

      {home.packages.length > 0 && (
        <Section id="packages">
          <Container className="flex flex-col gap-[18px] lg:gap-10">
            <SectionHeading
              overline={t.packages.overline || ASIDES.packages}
              title={t.packages.title}
              linkLabel={t.packages.linkLabel}
              href="/packages"
            />
            <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3 lg:gap-[26px]">
              {home.packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} variant="home" />
              ))}
              <CustomTripCard email={company.email} />
            </div>
          </Container>
        </Section>
      )}

      {home.offers.length > 0 && (
        <section id="offers" className="contour-bg mt-12 bg-navy text-page lg:mt-[100px]">
          <Container className="flex flex-col gap-5 py-10 lg:gap-10 lg:py-[100px]">
            <SectionHeading
              light
              overline={t.offers.overline || ASIDES.offers}
              title={t.offers.title}
              linkLabel={t.offers.linkLabel}
              href="/offers"
            />
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              {home.offers.map((offer, index) => (
                <OfferTeaserCard key={offer.id} offer={offer} tone={offerTone(index)} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {home.gallery.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-3 lg:gap-12">
            <SectionHeading
              overline={t.gallery.overline || ASIDES.gallery}
              title={t.gallery.title}
              linkLabel={t.gallery.linkLabel}
              href="/gallery"
            />
            <div className="no-scrollbar -mx-5 flex items-start gap-[18px] overflow-x-auto px-6 pt-4 pb-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-10 lg:overflow-visible lg:px-2.5 lg:pt-3 lg:pb-0">
              {home.gallery.map((photo, index) => (
                <Link
                  key={photo.id}
                  href="/gallery"
                  style={polaroidTilt(index)}
                  className={cn(
                    polaroidFrame,
                    'w-[230px] shrink-0 lg:w-auto',
                    index % 3 === 1 && 'lg:mt-[30px]',
                  )}
                >
                  <PolaroidContent photo={photo} index={index} sizes="(min-width: 1024px) 400px, 230px" />
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {home.reviews.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-4 lg:gap-10">
            <SectionHeading
              overline={t.testimonials.overline || ASIDES.testimonials}
              title={t.testimonials.title}
            />
            <Scroller className="lg:grid-cols-3 lg:gap-7">
              {home.reviews.map((review) => (
                <div key={review.id} className="flex snap-start">
                  <ReviewCard review={review} />
                </div>
              ))}
            </Scroller>
          </Container>
        </Section>
      )}

      {home.posts.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-4 lg:gap-10">
            <SectionHeading
              overline={t.blog.overline || ASIDES.blog}
              title={t.blog.title}
              linkLabel={t.blog.linkLabel}
              href="/blog"
            />
            <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {home.posts.map((post) => (
                <BlogCard key={post.id} post={post} imageHeight="lg:h-[260px]" />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* About + "Plan your next journey" band (design: Main about/contact panel). */}
      <Container as="section" aria-label={t.about.title} className="pt-12 pb-12 lg:pt-[100px] lg:pb-[110px]">
        <div className="relative isolate flex flex-col overflow-hidden rounded-[26px] bg-pine text-page lg:flex-row lg:flex-wrap lg:rounded-[32px]">
          <svg
            viewBox="0 0 1280 420"
            preserveAspectRatio="xMidYMax slice"
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full"
          >
            <path
              d="M0 420 L0 300 L120 250 L220 280 L360 190 L460 250 L560 220 L700 290 L820 230 L940 270 L1060 200 L1180 260 L1280 230 L1280 420 Z"
              fill="#1d3d32"
            />
            <path
              d="M0 420 L0 360 L200 330 L420 350 L640 320 L860 345 L1080 318 L1280 340 L1280 420 Z"
              fill="#12261f"
            />
          </svg>
          <div className="flex flex-col gap-3.5 px-[22px] pt-[30px] pb-4 lg:flex-[1_1_420px] lg:p-14">
            {t.about.overline && <Eyebrow light>{t.about.overline}</Eyebrow>}
            <h2 className="text-[24px] leading-[1.08] lg:text-[clamp(28px,3vw,38px)] lg:leading-[1.05]">
              {t.about.title}
            </h2>
            <p className="max-w-[520px] text-footer-text">{t.about.subtitle}</p>
            {t.about.stats.length > 0 && (
              <dl className="flex flex-wrap gap-x-8 gap-y-3 py-1">
                {t.about.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse">
                    <dt className="text-sm text-footer-text">{stat.label}</dt>
                    <dd className="font-display text-[24px]">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Link
              href="/about"
              className="inline-flex items-center gap-2 self-start font-bold text-gold-light hover:text-page"
            >
              {t.about.linkLabel}
              <ArrowIcon />
            </Link>
          </div>
          <div className="flex flex-col justify-center gap-3 px-[22px] pt-4 pb-14 lg:flex-[1_1_380px] lg:gap-4 lg:p-14">
            <span className="font-hand text-[20px] leading-snug text-gold-light lg:text-[22px]">
              {t.ctaBanner.title}
            </span>
            <p className="text-lg lg:text-xl">{t.ctaBanner.text}</p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={enquiryHref()} variant="accent" size="lg">
                {t.ctaBanner.buttonLabel}
                <ArrowIcon />
              </Button>
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full border border-page/45 px-[22px] font-semibold transition hover:bg-page/10 lg:h-[54px]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                  {company.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>

      <MobileTabBar />
    </main>
  );
}
