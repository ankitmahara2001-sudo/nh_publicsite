import Link from 'next/link';
import { OfferCard, offerTone } from '@/components/cards/OfferCard';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHero } from '@/components/ui/PageHero';
import { getApi } from '@/lib/api';
import { pageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/server';
import { enquiryHref } from '@/lib/enquiry';

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
        theme="sunset"
        title={page.title}
        subtitle={page.subtitle}
        imageUrl={page.imageUrl}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Offers' }]}
        active="offers"
        overline="a little something for the road"
      />

      <Container className="flex flex-col gap-6 pt-6 pb-12 lg:gap-10 lg:pt-12 lg:pb-[100px]">
        {page.steps.length > 0 && (
          <section aria-label="How to use a coupon">
            <ol className="grid gap-3 md:grid-cols-3 lg:gap-4">
              {page.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-4 rounded-[20px] border border-line bg-surface p-[18px] lg:p-[22px]"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-navy font-display text-lg text-gold-light"
                  >
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
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              {offers.map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} tone={offerTone(index)} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No offers right now"
              text="New coupon codes are added through the season. Check back soon, or ask us about current deals."
            >
              <Link href={enquiryHref()} className="text-sm font-bold text-navy underline">
                Contact us
              </Link>
            </EmptyState>
          )}

          {page.termsText && (
            <p className="rounded-[20px] bg-sand px-5 py-[18px] text-sm leading-[22px] text-body lg:px-6 lg:py-[22px]">
              <strong className="text-ink">Terms.</strong> {page.termsText}
            </p>
          )}
        </section>
      </Container>
    </main>
  );
}
