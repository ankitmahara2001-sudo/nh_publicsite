import { redirect } from 'next/navigation';
import { getCustomer } from './server';

/** The logged-in customer for an account page; logged-out visitors go to /login and come back. */
export async function requireCustomerPage(path) {
  const customer = await getCustomer();
  if (!customer) redirect(`/login?next=${encodeURIComponent(path)}`);
  return customer;
}
