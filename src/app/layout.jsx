import { Manrope } from 'next/font/google';
import { preconnect } from 'react-dom';
import { Footer } from '@/components/layout/Footer';
import { BROWSER_API_ORIGIN } from '@/lib/api';
import { getSiteSettings } from '@/lib/server';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

/** Site-wide SEO defaults from the admin "SEO" settings; pages override title and description. */
export async function generateMetadata() {
  const { seo, company } = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.defaultTitle, template: seo.titleTemplate || `%s | ${company.name}` },
    description: seo.description,
    openGraph: {
      siteName: company.name,
      type: 'website',
      locale: 'en_IN',
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : [],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function RootLayout({ children }) {
  // Photos come from Cloudinary; the login state and price quotes come from the API.
  preconnect('https://res.cloudinary.com');
  preconnect(BROWSER_API_ORIGIN, { crossOrigin: 'use-credentials' });
  const { company, social } = await getSiteSettings();
  return (
    <html lang="en-IN" className={`${manrope.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-gold px-4 py-2 font-bold text-navy focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <div id="main" className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer company={company} social={social} />
      </body>
    </html>
  );
}
