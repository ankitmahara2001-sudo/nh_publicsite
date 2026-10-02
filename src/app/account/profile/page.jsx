import { AccountHeading } from '@/components/account/AccountHeading';
import { ProfileForm } from '@/components/account/ProfileForm';
import { Panel } from '@/components/ui/Panel';
import { requireCustomerPage } from '@/lib/account';

export const metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const customer = await requireCustomerPage('/account/profile');

  return (
    <section aria-labelledby="profile-title" className="flex flex-col gap-5">
      <AccountHeading id="profile-title">Profile</AccountHeading>
      <Panel className="max-w-[560px]">
        <p className="mb-5 text-[15px] leading-6 text-body">
          We use these details for your bookings and to reach you about your trip.
        </p>
        <ProfileForm
          initial={customer}
          email={customer.email}
          successMessage="Your profile has been saved."
        />
      </Panel>
    </section>
  );
}
