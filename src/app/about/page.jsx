import { Button } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Overline } from '@/components/ui/SectionHeading';
import { pageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/server';

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

const H2 =
  'text-2xl leading-[30px] font-extrabold tracking-[-0.5px] lg:text-[36px] lg:leading-[44px] lg:tracking-[-1px]';

/** "01", "02"… */
const itemNumber = (index) => String(index + 1).padStart(2, '0');

function Heading({ overline, title }) {
  return (
    <div className="flex flex-col gap-2.5">
      {overline && <Overline className="hidden lg:inline">{overline}</Overline>}
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
            <p key={paragraph} className="text-[15px] leading-6 text-body lg:text-[17px] lg:leading-7">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="relative h-[220px] overflow-hidden rounded-[var(--radius-card)] lg:h-[420px] lg:flex-1 lg:rounded-[var(--radius-panel)]">
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
              className="flex gap-3.5 rounded-[var(--radius-card)] border border-line bg-surface p-[18px] md:flex-col md:gap-2.5 lg:p-7"
            >
              <span aria-hidden="true" className="text-xl font-extrabold text-gold lg:text-[26px]">
                {itemNumber(index)}
              </span>
              <div className="flex flex-col gap-1 lg:gap-2.5">
                <h3 className="text-base font-bold lg:text-[19px]">{value.title}</h3>
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
        <dl className="grid grid-cols-2 gap-5 rounded-[var(--radius-card)] bg-navy p-6 text-white lg:grid-cols-4 lg:gap-6 lg:rounded-[var(--radius-panel)] lg:px-14 lg:py-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1.5">
              <dt className="text-[13px] text-footer-text lg:text-[15px]">{stat.label}</dt>
              <dd className="text-[26px] font-extrabold lg:text-[40px]">{stat.value}</dd>
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
                <p className="text-[15px] font-bold lg:text-[17px]">{member.name}</p>
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
      <div className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-sand p-[22px] lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:rounded-[var(--radius-panel)] lg:px-14 lg:py-11">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-extrabold lg:text-[30px] lg:leading-[38px]">{cta.title}</h2>
          {cta.text && <p className="hidden text-base text-body lg:block">{cta.text}</p>}
        </div>
        <div className="flex flex-col gap-3 lg:flex-row-reverse">
          <Button href="/contact" size="lg" className="w-full lg:w-auto">
            {cta.primaryLabel}
          </Button>
          {/* The phone design shows only the primary button. */}
          <span className="hidden lg:block">
            <Button href="/packages" variant="outline" size="lg">
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
        title={about.hero.title}
        subtitle={about.hero.subtitle}
        imageUrl={about.hero.imageUrl}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About us' }]}
        active="about"
        heightClass="h-[340px] lg:h-[440px]"
      />
      <Story story={about.story} />
      <Values heading={about.valuesHeading} values={about.values} />
      <Stats stats={about.stats} />
      <Team heading={about.teamHeading} team={about.team} />
      <CallToAction cta={about.cta} />
    </main>
  );
}
