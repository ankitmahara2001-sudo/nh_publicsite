import { AccountNav } from '@/components/account/AccountNav';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/Container';

export const metadata = {
  robots: { index: false, follow: false },
};

/** Shared frame for the customer's account pages. Each page checks the login itself. */
export default function AccountLayout({ children }) {
  return (
    <>
      <Header variant="solid" />
      <main className="flex-1 bg-page pt-6 pb-10 lg:pt-12 lg:pb-20">
        <Container className="flex max-w-[1120px] flex-col gap-6 lg:gap-8">
          <AccountNav />
          {children}
        </Container>
      </main>
    </>
  );
}
