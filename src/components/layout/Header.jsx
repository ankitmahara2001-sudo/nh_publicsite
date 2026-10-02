import { getSiteSettings } from '@/lib/server';
import { SiteHeader } from './SiteHeader';

/** Server wrapper: loads the company settings for the (client) site header. */
export async function Header({ variant = 'transparent', active }) {
  const { company } = await getSiteSettings();
  return (
    <SiteHeader
      variant={variant}
      active={active}
      company={{ name: company.name, phone: company.phone, email: company.email }}
    />
  );
}
