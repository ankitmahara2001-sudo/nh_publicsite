import { notFound } from 'next/navigation';
import { PackageBookingCard } from '@/components/package/PackageBookingCard';
import { PackageHero } from '@/components/package/PackageHero';
import { PackagePhotos } from '@/components/package/PackagePhotos';
import {
  FaqSection,
  HotelsSection,
  InclusionsSection,
  ItinerarySection,
  OverviewSection,
  ReviewsSection,
} from '@/components/package/PackageSections';
import { SectionNav } from '@/components/package/SectionNav';
import { getOrNull, getSiteSettings } from '@/lib/server';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pkg = await getOrNull(`/packages/${slug}`);
  if (!pkg) return { title: 'Package not found' };
  const description = pkg.seoDescription || pkg.overview.slice(0, 160);
  return {
    title: pkg.seoTitle || pkg.title,
    description,
    alternates: { canonical: `/packages/${pkg.slug}` },
    openGraph: {
      title: pkg.seoTitle || pkg.title,
      description,
      images: pkg.coverImageUrl ? [{ url: pkg.coverImageUrl }] : [],
    },
  };
}

/** Product + Offer structured data for search engines. */
function packageJsonLd(pkg) {
  const lowest = Math.min(...pkg.prices.map((p) => p.sellingPrice));
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.title,
    description: pkg.overview,
    image: [pkg.coverImageUrl, ...pkg.images.map((i) => i.url)].filter(Boolean),
    brand: { '@type': 'Brand', name: 'Norther Harier' },
    ...(pkg.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: pkg.rating,
            reviewCount: pkg.reviewCount,
          },
        }
      : {}),
    ...(pkg.prices.length
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: lowest / 100,
            offerCount: pkg.prices.length,
            url: absoluteUrl(`/packages/${pkg.slug}`),
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

const SECTIONS = [
  { id: 'overview', label: 'Overview', show: () => true },
  { id: 'itinerary', label: 'Itinerary', show: (p) => p.itinerary.length > 0 },
  { id: 'inclusions', label: 'Inclusions', show: (p) => p.included.length + p.excluded.length > 0 },
  { id: 'hotels', label: 'Hotels', show: (p) => p.hotels.length > 0 },
  { id: 'reviews', label: 'Reviews', show: (p) => p.reviews.length > 0 },
  { id: 'faq', label: 'FAQ', show: (p) => p.faqs.length > 0 },
];

export default async function PackagePage({ params }) {
  const { slug } = await params;
  const [pkg, settings] = await Promise.all([getOrNull(`/packages/${slug}`), getSiteSettings()]);
  if (!pkg) notFound();

  const sections = SECTIONS.filter((s) => s.show(pkg)).map(({ id, label }) => ({ id, label }));

  return (
    <main className="pb-[76px] lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packageJsonLd(pkg)).replace(/</g, '\\u003c') }}
      />
      <PackageHero pkg={pkg} />
      <SectionNav sections={sections} />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pt-3 pb-10 lg:flex-row lg:items-start lg:gap-12 lg:px-20 lg:pt-12 lg:pb-20">
        <div className="flex min-w-0 flex-1 flex-col gap-10 lg:gap-14">
          <OverviewSection pkg={pkg} photoGrid={<PackagePhotos title={pkg.title} images={pkg.images} />} />
          <ItinerarySection itinerary={pkg.itinerary} />
          <InclusionsSection included={pkg.included} excluded={pkg.excluded} />
          <HotelsSection hotels={pkg.hotels} />
          <ReviewsSection reviews={pkg.reviews} rating={pkg.rating} reviewCount={pkg.reviewCount} />
          <div className="hidden lg:block">
            <FaqSection faqs={pkg.faqs} />
          </div>
        </div>
        <aside
          id="book"
          aria-label="Book this trip"
          className="scroll-mt-20 lg:sticky lg:top-20 lg:w-[400px] lg:shrink-0"
        >
          <h2 className="mb-3 text-[22px] font-extrabold lg:sr-only">Choose your package</h2>
          <PackageBookingCard pkg={pkg} cancellationNote={settings.booking?.freeCancellationNote} />
        </aside>
        <div className="lg:hidden">
          <FaqSection faqs={pkg.faqs} />
        </div>
      </div>
    </main>
  );
}
