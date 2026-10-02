import Link from 'next/link';
import { OfferCard } from '@/components/cards/OfferCard';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHero } from '@/components/ui/PageHero';
import { getApi } from '@/lib/api';
import { pageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/server';

export const revalidate = 60;

export async function generateMetadata() {
  const { pages, company } = await getSiteSettings();
  const hero = pages.offers;
  return pageMetadata({
    title: hero.title,
    description: hero.subtitle,
    imageUrl: hero.imageUrl,
    path: '/offers',
    siteName: company.name,
  });
}

/** "01", "02"… */
const stepNumber = (index) => String(index + 1).padStart(2, '0');

export default async function OffersPage() {
  const [{ data: offers }, { pages }] = await Promise.all([getApi('/offers'), getSiteSettings()]);
  const page = pages.offers;

  return (
    <main>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        imageUrl={page.imageUrl}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Offers' }]}
        active="offers"
      />

      <Container className="flex flex-col gap-6 pt-6 pb-10 lg:gap-10 lg:pt-14 lg:pb-20">
        {page.steps.length > 0 && (
          <section aria-label="How to use a coupon">
            <ol className="grid gap-3 md:grid-cols-3 lg:gap-4">
              {page.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-[18px] lg:p-[22px]"
                >
                  <span aria-hidden="true" className="text-[22px] font-extrabold text-gold lg:text-[26px]">
                    {stepNumber(index)}
                  </span>
                  <span className="text-[15px] leading-[22px]">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section aria-label="Coupon codes" className="flex flex-col gap-6">
          {offers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No offers right now"
              text="New coupon codes are added through the season. Check back soon, or ask us about current deals."
            >
              <Link href="/contact" className="text-sm font-bold text-navy underline">
                Contact us
              </Link>
            </EmptyState>
          )}

          {page.termsText && (
            <p className="rounded-[var(--radius-card)] bg-sand px-5 py-[18px] text-sm leading-[22px] text-body lg:px-6 lg:py-[22px]">
              <strong className="text-ink">Terms.</strong> {page.termsText}
            </p>
          )}
        </section>
      </Container>
    </main>
  );
}
