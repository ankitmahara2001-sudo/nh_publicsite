import Link from 'next/link';
import { EnquiryForm } from '@/components/contact/EnquiryForm';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { getApi } from '@/lib/api';
import { pageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/server';

export const revalidate = 60;

export async function generateMetadata() {
  const { contact, company } = await getSiteSettings();
  return pageMetadata({
    title: contact.hero.title,
    description: contact.hero.subtitle,
    imageUrl: contact.hero.imageUrl,
    path: '/contact',
    siteName: company.name,
  });
}

const PANEL =
  'flex flex-col gap-2.5 rounded-[var(--radius-card)] p-5 lg:rounded-[var(--radius-panel)] lg:p-6';

const isExternal = (href) => /^https?:\/\//.test(href);

function ChannelCard({ channel }) {
  const external = isExternal(channel.href);
  const content = (
    <>
      <span className="text-[15px] font-extrabold lg:text-[17px]">{channel.title}</span>
      <span className="text-[13px] break-words text-muted lg:text-[15px] lg:font-semibold lg:text-navy">
        {channel.value}
      </span>
      {channel.note && <span className="hidden text-[13px] text-muted lg:block">{channel.note}</span>}
    </>
  );
  const classes =
    'flex h-full flex-col gap-1 rounded-xl border border-line bg-surface p-4 lg:gap-1.5 lg:rounded-[var(--radius-card)] lg:p-6';
  if (!channel.href) return <div className={classes}>{content}</div>;
  return (
    <a
      href={channel.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`${classes} transition hover:border-navy`}
    >
      {content}
    </a>
  );
}

function OfficeMap({ company }) {
  if (company.mapEmbedUrl) {
    return (
      <iframe
        src={company.mapEmbedUrl}
        title={`Map of our office, ${company.shortAddress || company.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[240px] w-full rounded-[var(--radius-panel)] border-0"
      />
    );
  }
  return (
    <div className="flex h-[240px] items-center justify-center rounded-[var(--radius-panel)] bg-[#c9cfd6] px-6 text-center text-sm text-[#3f4652]">
      Map · {company.shortAddress || company.address}
    </div>
  );
}

export default async function ContactPage() {
  const [{ data: destinations }, { contact, company }] = await Promise.all([
    getApi('/destinations'),
    getSiteSettings(),
  ]);

  return (
    <main>
      <PageHero
        title={contact.hero.title}
        subtitle={contact.hero.subtitle}
        imageUrl={contact.hero.imageUrl}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        active="contact"
      />

      {contact.channels.length > 0 && (
        <Container as="section" aria-label="Ways to reach us" className="pt-5 lg:pt-14">
          <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-5">
            {contact.channels.map((channel) => (
              <li key={channel.title}>
                <ChannelCard channel={channel} />
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Container className="flex flex-col gap-5 pt-5 pb-10 lg:flex-row lg:items-start lg:gap-12 lg:pt-12 lg:pb-20">
        <EnquiryForm
          destinations={destinations.map((destination) => destination.name)}
          title={contact.formTitle || 'Send us a message'}
          note={contact.formNote}
          successMessage={contact.successMessage || 'Thank you, {name}. We will be in touch soon.'}
        />

        <aside aria-label="Our office" className="flex flex-col gap-5 lg:w-[400px] lg:shrink-0">
          <OfficeMap company={company} />
          <div className={`${PANEL} border border-line bg-surface text-[15px] leading-6`}>
            <h2 className="text-[17px] font-extrabold">Visit our office</h2>
            <address className="whitespace-pre-line not-italic">
              {[company.legalName || company.name, company.address].filter(Boolean).join('\n')}
            </address>
            {company.officeHours && <p className="text-muted">{company.officeHours}</p>}
          </div>
          {contact.quickLinks.length > 0 && (
            <nav aria-labelledby="quick-answers" className={`${PANEL} bg-sand`}>
              <h2 id="quick-answers" className="text-[17px] font-extrabold">
                Quick answers
              </h2>
              <ul>
                {contact.quickLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="flex min-h-11 items-center text-[15px] text-navy hover:text-gold-text"
                    >
                      {link.label}&nbsp;<span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </Container>
    </main>
  );
}
