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
        <p className="text-xs font-bold tracking-[2.4px] text-gold-text uppercase">Error 404</p>
        <h1 className="mt-3 text-[28px] leading-9 font-extrabold tracking-[-0.6px] lg:text-[36px] lg:leading-[44px] lg:tracking-[-1px]">
          This trail doesn’t lead anywhere
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-body lg:text-base">
          The page you were looking for has moved or no longer exists. Let’s get you back on the road.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Go to home</Button>
          <Button href="/packages" variant="outline">
            Browse packages
          </Button>
        </div>
      </CenteredPage>
    </>
  );
}
