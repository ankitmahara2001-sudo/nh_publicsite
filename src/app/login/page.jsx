import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LoginFlow } from '@/components/auth/LoginFlow';
import { LoginScenery } from '@/components/auth/LoginScenery';
import { safeNextPath } from '@/lib/safeRedirect';
import { getCustomer, getSiteSettings } from '@/lib/server';

export const metadata = {
  title: 'Log in',
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }) {
  const nextPath = safeNextPath((await searchParams).next);
  const customer = await getCustomer();
  // Logged in already: go on, unless the profile (name + phone) still has to be completed.
  if (customer?.profileComplete) redirect(nextPath);
  const { company } = await getSiteSettings();

  // Design: Login (desktop) — scenic night pane + form pane; Mobile-Login — scene on top, form in a sheet.
  return (
    <main className="flex flex-1 flex-col bg-night lg:min-h-svh lg:flex-row lg:bg-page">
      <LoginScenery companyName={company.name} />
      <section className="relative z-10 -mt-11 flex flex-1 justify-center rounded-t-[28px] bg-page px-[22px] pt-3.5 pb-10 lg:mt-0 lg:items-center lg:rounded-none lg:px-6 lg:py-12">
        <div className="flex w-full max-w-[440px] flex-col">
          <span
            aria-hidden="true"
            className="mb-5 h-[5px] w-11 self-center rounded-full bg-input lg:hidden"
          />
          <LoginFlow nextPath={nextPath} initialCustomer={customer} />
          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[13px] text-muted">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            Your details stay private. Payments secured by Razorpay.
          </p>
          <p className="mt-2 text-center text-xs text-muted">
            By continuing you agree to our{' '}
            <Link href="/policies/terms" className="font-semibold text-gold-text underline">
              Terms
            </Link>{' '}
            &amp;{' '}
            <Link href="/policies/privacy" className="font-semibold text-gold-text underline">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
