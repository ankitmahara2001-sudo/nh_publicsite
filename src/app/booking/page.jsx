import { notFound, redirect } from 'next/navigation';
import { BookingFlow } from '@/components/booking/BookingFlow';
import { Header } from '@/components/layout/Header';
import { fromBookingSearch } from '@/lib/bookingSelection';
import { getCustomer, getOrNull, getSiteSettings } from '@/lib/server';

export const metadata = {
  title: 'Complete your booking',
  robots: { index: false, follow: false },
};

/** The page URL with its query, to come back to after logging in. */
function bookingPath(searchParams) {
  const query = new URLSearchParams(
    Object.entries(searchParams).flatMap(([key, value]) => (Array.isArray(value) ? [] : [[key, value]])),
  );
  return `/booking?${query.toString()}`;
}

/** /booking?package=&price=&date=|departure=&adults=… (design/Booking.dc.html). Login required. */
export default async function BookingPage({ searchParams }) {
  const params = await searchParams;
  const selection = fromBookingSearch(params);
  if (!selection.slug) notFound();

  // Booking needs an account with name and phone; the login page also completes the profile.
  const customer = await getCustomer();
  if (!customer?.profileComplete) {
    redirect(`/login?next=${encodeURIComponent(bookingPath(params))}`);
  }

  const [pkg, settings] = await Promise.all([
    getOrNull(`/packages/${encodeURIComponent(selection.slug)}`),
    getSiteSettings(),
  ]);
  if (!pkg) notFound();

  return (
    <>
      <Header variant="solid" active="packages" />
      <main className="flex-1 bg-page">
        <BookingFlow
          pkg={pkg}
          selection={selection}
          customer={customer}
          booking={settings.booking}
          companyName={settings.company.name}
        />
      </main>
    </>
  );
}
