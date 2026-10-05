import { GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS } from '@/domain/enums';
import Link from 'next/link';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { PageHero } from '@/components/ui/PageHero';
import { getApi } from '@/lib/api';
import { pageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/server';
import { buildHref, oneOf } from '@/lib/url';

export const revalidate = 60;

export async function generateMetadata() {
  const { pages, company } = await getSiteSettings();
  const hero = pages.gallery;
  return pageMetadata({
    title: hero.title,
    description: hero.subtitle,
    imageUrl: hero.imageUrl,
    path: '/gallery',
    siteName: company.name,
  });
}

export default async function GalleryPage({ searchParams }) {
  const category = oneOf((await searchParams).category, GALLERY_CATEGORIES);
  const [{ data: photos }, { pages }] = await Promise.all([
    getApi('/gallery', { params: { category } }),
    getSiteSettings(),
  ]);
  const hero = pages.gallery;

  const tabs = [
    { key: 'all', label: 'All', href: '/gallery', active: !category },
    ...GALLERY_CATEGORIES.map((key) => ({
      key,
      label: GALLERY_CATEGORY_LABELS[key],
      href: buildHref('/gallery', { category: key }),
      active: category === key,
    })),
  ];

  return (
    <main>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        imageUrl={hero.imageUrl}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
        active="gallery"
      />

      <Container
        as="section"
        aria-label="Photos"
        className="flex flex-col gap-4 pt-4 pb-10 lg:gap-7 lg:pt-14 lg:pb-20"
      >
        <FilterTabs label="Photo category" items={tabs} />
        {photos.length > 0 ? (
          <GalleryGrid photos={photos} />
        ) : (
          <EmptyState
            title="No photos here yet"
            text="We add new photos after every season. Have a look at the other categories in the meantime."
          >
            {category && (
              <Link href="/gallery" className="text-sm font-bold text-navy underline">
                See all photos
              </Link>
            )}
          </EmptyState>
        )}
      </Container>
    </main>
  );
}
