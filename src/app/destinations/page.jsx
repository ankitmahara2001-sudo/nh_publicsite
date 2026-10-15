import { REGIONS, REGION_LABELS } from '@/domain/enums';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { getApi } from '@/lib/api';
import { pageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/server';
import { buildHref, oneOf } from '@/lib/url';

export const revalidate = 60;

export async function generateMetadata() {
  const { pages, company } = await getSiteSettings();
  const hero = pages.destinations;
  return pageMetadata({
    title: hero.title,
    description: hero.subtitle,
    imageUrl: hero.imageUrl,
    path: '/destinations',
    siteName: company.name,
  });
}

const packageCountLabel = (count) => `${count} ${count === 1 ? 'package' : 'packages'}`;

function DestinationCard({ destination }) {
  return (
    <article className="lift flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface">
      <div className="relative h-[200px] lg:h-[230px]">
        <Photo
          src={destination.coverImageUrl}
          alt={destination.name}
          sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-[22px] pt-5 pb-4">
        <span className="text-xs font-bold tracking-[.16em] text-pine uppercase">{destination.district}</span>
        <h2 className="text-[22px] leading-[1.1]">{destination.name}</h2>
        {destination.shortDescription && (
          <p className="text-[15px] leading-6 text-muted">{destination.shortDescription}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-gold-text">{packageCountLabel(destination.packageCount)}</span>
          <Link
            href={buildHref('/packages', { destination: destination.slug })}
            className="inline-flex h-11 items-center font-bold text-ink hover:text-gold-text"
          >
            Explore <span className="sr-only">&nbsp;{destination.name} packages</span>
            <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function DestinationsPage({ searchParams }) {
  const region = oneOf((await searchParams).region, REGIONS);
  const [{ data: destinations }, { pages }] = await Promise.all([getApi('/destinations'), getSiteSettings()]);
  const hero = pages.destinations;
  const shown = region ? destinations.filter((destination) => destination.region === region) : destinations;

  const tabs = [
    { key: 'all', label: 'All regions', href: '/destinations', active: !region },
    ...REGIONS.map((key) => ({
      key,
      label: REGION_LABELS[key],
      href: buildHref('/destinations', { region: key }),
      active: region === key,
    })),
  ];

  return (
    <main>
      <PageHero
        theme="mist"
        title={hero.title}
        subtitle={hero.subtitle}
        imageUrl={hero.imageUrl}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Destinations' }]}
        active="destinations"
        overline="pick a valley"
      />

      <Container
        as="section"
        aria-label="Destinations"
        className="flex flex-col gap-5 pt-6 pb-12 lg:gap-8 lg:pt-12 lg:pb-[100px]"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterTabs label="Region" items={tabs} />
          <p className="text-sm text-muted" aria-live="polite">
            {shown.length} {shown.length === 1 ? 'destination' : 'destinations'}
          </p>
        </div>

        {shown.length > 0 ? (
          <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3 lg:gap-[22px]">
            {shown.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No destinations here yet"
            text="We are adding new places all the time. Try another region or browse all our packages."
          >
            <Link href="/packages" className="text-sm font-bold text-navy underline">
              Browse packages
            </Link>
          </EmptyState>
        )}
      </Container>
    </main>
  );
}
