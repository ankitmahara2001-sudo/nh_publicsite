import { POLICY_SLUGS } from '@/domain/enums';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { pageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/server';

export const revalidate = 60;

/** The policy for a URL slug, or null for unknown slugs. */
async function getPolicy(slug) {
  if (!POLICY_SLUGS.includes(slug)) return null;
  const { policies } = await getSiteSettings();
  return policies[slug] ?? null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [policy, { company }] = await Promise.all([getPolicy(slug), getSiteSettings()]);
  if (!policy) return {};
  return pageMetadata({ title: policy.title, path: `/policies/${slug}`, siteName: company.name });
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const policy = await getPolicy(slug);
  if (!policy) notFound();

  return (
    <>
      <Header variant="solid" />
      <main className="flex-1 px-5 py-8 lg:py-16">
        <article className="mx-auto flex max-w-[820px] flex-col gap-4 rounded-[var(--radius-panel)] border border-line bg-surface p-6 lg:gap-5 lg:p-12">
          <Breadcrumb light={false} items={[{ label: 'Home', href: '/' }, { label: policy.title }]} />
          <h1 className="text-[32px] leading-9 font-extrabold tracking-[-0.8px] lg:text-[40px] lg:leading-[48px] lg:tracking-[-1px]">
            {policy.title}
          </h1>
          {policy.content ? (
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: policy.content }} />
          ) : (
            <p className="text-[15px] leading-6 text-muted">
              This policy will be published here soon. For any questions, please contact us.
            </p>
          )}
        </article>
      </main>
    </>
  );
}
