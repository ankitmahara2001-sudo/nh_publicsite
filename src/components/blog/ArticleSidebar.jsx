import { formatRupees, priceUnitLabel } from '@/domain/format';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { CopyLinkButton } from './CopyLinkButton';

const CARD = 'flex flex-col gap-3 rounded-[22px] border border-line bg-surface p-[22px]';
const CARD_TITLE = 'font-sans text-xs font-bold tracking-[.16em] text-pine uppercase';
const SHARE_PILL =
  'inline-flex h-11 items-center rounded-full border border-chip px-4 text-sm font-semibold text-ink transition hover:border-navy';

function TableOfContents({ headings }) {
  if (headings.length === 0) return null;
  return (
    <nav aria-labelledby="toc-title" className={CARD}>
      <h2 id="toc-title" className={CARD_TITLE}>
        In this article
      </h2>
      <ul className="flex flex-col">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="flex min-h-11 items-center text-[15px] font-medium text-ink hover:text-gold-text"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ShareCard({ url, title }) {
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  return (
    <div className={CARD}>
      <h2 className={CARD_TITLE}>Share this guide</h2>
      <div className="flex flex-wrap gap-2.5">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={SHARE_PILL}>
          WhatsApp<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a href={facebook} target="_blank" rel="noopener noreferrer" className={SHARE_PILL}>
          Facebook<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <CopyLinkButton url={url} className={SHARE_PILL} />
      </div>
    </div>
  );
}

function RelatedPackage({ pkg }) {
  const price = pkg.price;
  return (
    <div className="overflow-hidden rounded-[22px] bg-pine text-page">
      <div className="relative h-[140px]">
        <Photo src={pkg.coverImageUrl} alt="" sizes="(min-width: 1024px) 340px, 100vw" />
      </div>
      <div className="flex flex-col gap-2 p-6">
        <span className="font-hand text-[20px] leading-snug text-gold-light">plan it with us</span>
        <h2 className="text-[21px] leading-[1.2]">{pkg.title}</h2>
        <p className="text-[15px] text-footer-text">
          {pkg.durationDays} days · {pkg.durationNights} nights
          {price &&
            ` · from ${formatRupees(price.sellingPrice)} ${priceUnitLabel(price.priceType, price.label)}`}
        </p>
        <Button
          href={`/packages/${pkg.slug}`}
          variant="accent"
          size="custom"
          className="mt-2 h-12 px-6 text-[15px]"
        >
          View package
        </Button>
      </div>
    </div>
  );
}

/** Blog article sidebar (design/BlogDetail): contents, share links, related package. */
export function ArticleSidebar({ headings, shareUrl, title, relatedPackage }) {
  return (
    <aside
      aria-label="About this article"
      className="flex flex-col gap-5 lg:sticky lg:top-6 lg:gap-6 lg:self-start"
    >
      <TableOfContents headings={headings} />
      <ShareCard url={shareUrl} title={title} />
      {relatedPackage && <RelatedPackage pkg={relatedPackage} />}
    </aside>
  );
}
