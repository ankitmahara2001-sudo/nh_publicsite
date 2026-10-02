import { redirect } from 'next/navigation';
import { LoginFlow } from '@/components/auth/LoginFlow';
import { Header } from '@/components/layout/Header';
import { CenteredPage } from '@/components/ui/CenteredPage';
import { safeNextPath } from '@/lib/safeRedirect';
import { getCustomer } from '@/lib/server';

export const metadata = {
  title: 'Log in',
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }) {
  const nextPath = safeNextPath((await searchParams).next);
  const customer = await getCustomer();
  // Logged in already: go on, unless the profile (name + phone) still has to be completed.
  if (customer?.profileComplete) redirect(nextPath);

  return (
    <>
      <Header variant="solid" />
      <CenteredPage width="max-w-[440px]">
        <LoginFlow nextPath={nextPath} initialCustomer={customer} />
      </CenteredPage>
    </>
  );
}
