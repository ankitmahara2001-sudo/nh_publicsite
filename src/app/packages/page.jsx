import { TRIP_TYPES, TRIP_TYPE_LABELS } from '@nh/shared';
import Link from 'next/link';
import { PackageCard } from '@/components/cards/PackageCard';
import { FilterSheet, FilterSidebar, SortSelect } from '@/components/package/PackageFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { PageHero } from '@/components/ui/PageHero';
import { Pagination } from '@/components/ui/Pagination';
import { getApi } from '@/lib/api';
import { pageMetadata } from '@/lib/metadata';
import { filtersHref, parseFilters, toApiQuery, upcomingMonths } from '@/lib/packageFilters';
import { getSiteSettings } from '@/lib/server';

export const revalidate = 60;

const PAGE_SIZE = 9;
const MONTHS_SHOWN = 6;
const EAGER_CARDS = 3; // first row is above the fold on desktop

export async function generateMetadata() {
  const { pages, company } = await getSiteSettings();
  const hero = pages.packages;
  return pageMetadata({
    title: hero.title,
    description: hero.subtitle,
    imageUrl: hero.imageUrl,
    path: '/packages',
    siteName: company.name,
  });
}

function tripTypeTabs(filters) {
  return [
    {
      key: 'all',
      label: 'All',
      href: filtersHref({ ...filters, tripType: '', page: 1 }),
      active: !filters.tripType,
    },
    ...TRIP_TYPES.map((type) => ({
      key: type,
      label: TRIP_TYPE_LABELS[type],
      href: filtersHref({ ...filters, tripType: type, page: 1 }),
      active: filters.tripType === type,
    })),
  ];
}

export default async function PackagesPage({ searchParams }) {
  const filters = parseFilters(await searchParams);
  const [{ data: packages, meta }, { data: destinations }, { pages }] = await Promise.all([
    getApi('/packages', { params: toApiQuery(filters, PAGE_SIZE) }),
    getApi('/destinations'),
    getSiteSettings(),
  ]);
  const hero = pages.packages;
  const totalPages = Math.ceil(meta.total / meta.pageSize);
  const months = upcomingMonths(MONTHS_SHOWN);
  const filterProps = { filters, destinations, months };

  return (
    <main>
      <PageHero
        title={hero.title}
        subtitle={
          <>
            <span className="lg:hidden">
              {meta.total} package{meta.total === 1 ? '' : 's'} across Uttarakhand
            </span>
            <span className="hidden lg:inline">{hero.subtitle}</span>
          </>
        }
        imageUrl={hero.imageUrl}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Packages' }]}
        active="packages"
      />

      <div className="mx-auto flex max-w-[1440px] gap-10 px-5 pt-4 pb-8 lg:items-start lg:px-20 lg:pt-14 lg:pb-20">
        <FilterSidebar {...filterProps} />

        <div className="flex min-w-0 flex-1 flex-col gap-3.5 lg:gap-6">
          <div className="flex gap-2.5 lg:hidden">
            <FilterSheet {...filterProps} />
            <SortSelect id="sort-mobile" filters={filters} className="flex-1" />
          </div>
          <div className="flex items-center justify-between gap-6">
            <FilterTabs label="Trip type" items={tripTypeTabs(filters)} className="min-w-0 lg:flex-1" />
            <SortSelect
              id="sort"
              filters={filters}
              className="hidden shrink-0 items-center gap-2.5 lg:flex"
            />
          </div>

          <p className="text-[13px] text-muted lg:text-sm" aria-live="polite">
            Showing {packages.length} of {meta.total} package{meta.total === 1 ? '' : 's'}
          </p>

          {packages.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
              {packages.map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} priority={filters.page === 1 && index < EAGER_CARDS} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No trips match these filters"
              text="Try fewer filters, another month or a different destination."
            >
              <Link href="/packages" className="text-sm font-bold text-navy underline">
                Show all packages
              </Link>
            </EmptyState>
          )}

          <Pagination
            page={filters.page}
            totalPages={totalPages}
            hrefFor={(page) => filtersHref({ ...filters, page })}
            className="mt-2 lg:mt-4"
          />
        </div>
      </div>
    </main>
  );
}
