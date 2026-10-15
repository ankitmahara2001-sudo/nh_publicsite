import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { CenteredPage } from '@/components/ui/CenteredPage';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header variant="solid" />
      <CenteredPage className="text-center">
        <p className="text-xs font-bold tracking-[.18em] uppercase text-gold-text">
          Error 404 · Lost in the deodars
        </p>
        <h1 className="mt-2 text-[26px] leading-[1.1] lg:text-[34px]">This trail doesn’t exist</h1>
        <p className="mt-3 text-[15px] leading-6 text-muted lg:text-base">
          The page you were looking for has moved or no longer exists. Head back to base camp.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" variant="accent">
            Back to base camp
          </Button>
          <Button href="/packages" variant="outline">
            Browse packages
          </Button>
        </div>
      </CenteredPage>
    </>
  );
}
