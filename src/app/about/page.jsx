import { Button } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Overline } from '@/components/ui/SectionHeading';
import { pageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/server';
import { enquiryHref } from '@/lib/enquiry';

export const revalidate = 60;

export async function generateMetadata() {
  const { about, company } = await getSiteSettings();
  return pageMetadata({
    title: about.hero.title,
    description: about.hero.subtitle,
    imageUrl: about.hero.imageUrl,
    path: '/about',
    siteName: company.name,
  });
}

const H2 = 'text-[24px] leading-[1.1] lg:text-[clamp(28px,3.2vw,40px)] lg:leading-[1.05]';

/** "01", "02"… */
const itemNumber = (index) => String(index + 1).padStart(2, '0');

function Heading({ overline, title }) {
  return (
    <div className="flex flex-col gap-1 lg:gap-2">
      {overline && <Overline>{overline}</Overline>}
      <h2 className={H2}>{title}</h2>
    </div>
  );
}

function Story({ story }) {
  return (
    <Section>
      <Container className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex flex-col gap-3.5 lg:w-[600px] lg:shrink-0 lg:gap-[18px]">
          {story.overline && <Overline>{story.overline}</Overline>}
          <h2 className={H2}>{story.title}</h2>
          {story.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-[1.6] text-muted lg:text-lg">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="relative h-[240px] overflow-hidden rounded-[var(--radius-card)] lg:h-[440px] lg:flex-1 lg:rounded-[30px]">
          <Photo src={story.imageUrl} alt="" sizes="(min-width: 1024px) 620px, 100vw" />
        </div>
      </Container>
    </Section>
  );
}

function Values({ heading, values }) {
  if (values.length === 0) return null;
  return (
    <Section>
      <Container className="flex flex-col gap-4 lg:gap-7">
        <Heading overline={heading.overline} title={heading.title} />
        <ol className="grid gap-3 md:grid-cols-3 lg:gap-6">
          {values.map((value, index) => (
            <li
              key={value.title}
              className="lift flex gap-3.5 rounded-[var(--radius-card)] border border-line bg-surface p-[18px] md:flex-col md:gap-3 lg:p-7"
            >
              <span
                aria-hidden="true"
                className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-navy font-display text-lg text-gold-light"
              >
                {itemNumber(index)}
              </span>
              <div className="flex flex-col gap-1 lg:gap-2">
                <h3 className="text-xl leading-tight lg:text-[21px]">{value.title}</h3>
                <p className="text-sm leading-[21px] text-muted lg:text-[15px] lg:leading-6">{value.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function Stats({ stats }) {
  if (stats.length === 0) return null;
  return (
    <Section>
      <Container>
        <dl className="contour-bg grid grid-cols-2 gap-5 rounded-[var(--radius-card)] bg-navy p-6 text-page lg:grid-cols-4 lg:gap-6 lg:rounded-[32px] lg:px-14 lg:py-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1.5">
              <dt className="text-[13px] text-footer-text lg:text-[15px]">{stat.label}</dt>
              <dd className="font-display text-[24px] leading-none lg:text-[36px]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

function Team({ heading, team }) {
  if (team.length === 0) return null;
  return (
    <Section>
      <Container className="flex flex-col gap-3.5 lg:gap-7">
        <Heading overline={heading.overline} title={heading.title} />
        <ul className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {team.map((member) => (
            <li key={member.name} className="flex w-[180px] shrink-0 flex-col gap-2 lg:w-auto lg:gap-3">
              <div className="relative h-[210px] overflow-hidden rounded-xl lg:h-[280px] lg:rounded-[var(--radius-card)]">
                <Photo
                  src={member.photoUrl}
                  alt={`Portrait of ${member.name}`}
                  sizes="(min-width: 1024px) 300px, 180px"
                />
              </div>
              <div>
                <p className="font-display text-lg lg:text-xl">{member.name}</p>
                <p className="text-[13px] text-muted lg:text-sm">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function CallToAction({ cta }) {
  return (
    <Container as="section" aria-label={cta.title} className="py-10 lg:py-20">
      <div className="relative isolate flex flex-col gap-4 overflow-hidden rounded-[26px] bg-pine p-[26px] pb-16 text-page lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:rounded-[32px] lg:px-14 lg:py-12">
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
        <div className="flex flex-col gap-2">
          <span aria-hidden="true" className="text-xs font-bold tracking-[.18em] uppercase text-gold-light">
            Plan your next journey
          </span>
          <h2 className="text-[24px] leading-[1.1] lg:text-[32px]">{cta.title}</h2>
          {cta.text && <p className="hidden text-lg text-footer-text lg:block">{cta.text}</p>}
        </div>
        <div className="flex flex-col gap-3 lg:flex-row-reverse">
          <Button href={enquiryHref()} variant="accent" size="lg" className="w-full lg:w-auto">
            {cta.primaryLabel}
          </Button>
          {/* The phone design shows only the primary button. */}
          <span className="hidden lg:block">
            <Button href="/packages" variant="outline-light" size="lg">
              {cta.secondaryLabel}
            </Button>
          </span>
        </div>
      </div>
    </Container>
  );
}

export default async function AboutPage() {
  const { about } = await getSiteSettings();
  return (
    <main>
      <PageHero
        theme="forest"
        title={about.hero.title}
        subtitle={about.hero.subtitle}
        imageUrl={about.hero.imageUrl}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About us' }]}
        active="about"
      />
      <Story story={about.story} />
      <Values heading={about.valuesHeading} values={about.values} />
      <Stats stats={about.stats} />
      <Team heading={about.teamHeading} team={about.team} />
      <CallToAction cta={about.cta} />
    </main>
  );
}
