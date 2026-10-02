import { BookingCard } from '@/components/account/BookingCard';
import { AccountHeading } from '@/components/account/AccountHeading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { requireCustomerPage } from '@/lib/account';
import { getAsCustomer } from '@/lib/server';

export const metadata = { title: 'My bookings' };

export default async function MyBookingsPage() {
  await requireCustomerPage('/account/bookings');
  const { data: bookings } = await getAsCustomer('/me/bookings');

  return (
    <section aria-labelledby="bookings-title" className="flex flex-col gap-5">
      <AccountHeading id="bookings-title">My bookings</AccountHeading>
      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          text="When you book a trip, it will appear here with its dates, payments and balance."
        >
          <Button href="/packages">Explore packages</Button>
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <li key={booking.bookingNumber}>
              <BookingCard booking={booking} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
