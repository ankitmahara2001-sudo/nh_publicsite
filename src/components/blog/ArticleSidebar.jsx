import { formatRupees, priceUnitLabel } from '@nh/shared';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { CopyLinkButton } from './CopyLinkButton';

const CARD = 'flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5 lg:p-6';
const SHARE_PILL =
  'inline-flex h-11 items-center rounded-full border border-input px-4 text-sm font-bold text-navy transition hover:border-navy';

function TableOfContents({ headings }) {
  if (headings.length === 0) return null;
  return (
    <nav aria-labelledby="toc-title" className={CARD}>
      <h2 id="toc-title" className="text-[15px] font-extrabold">
        In this article
      </h2>
      <ul className="flex flex-col">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="flex min-h-11 items-center text-[15px] text-navy hover:text-gold-text"
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
      <h2 className="text-[15px] font-extrabold">Share this guide</h2>
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
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-navy text-white">
      <div className="relative h-[150px]">
        <Photo src={pkg.coverImageUrl} alt="" sizes="(min-width: 1024px) 440px, 100vw" />
      </div>
      <div className="flex flex-col gap-2 p-[22px]">
        <span className="text-xs font-bold tracking-[1.8px] text-gold-light uppercase">Related package</span>
        <h2 className="text-lg font-bold">{pkg.title}</h2>
        <p className="text-sm text-footer-text">
          {pkg.durationDays} days · {pkg.durationNights} nights
          {price &&
            ` · from ${formatRupees(price.sellingPrice)} ${priceUnitLabel(price.priceType, price.label)}`}
        </p>
        <Button
          href={`/packages/${pkg.slug}`}
          variant="accent"
          size="custom"
          className="mt-2 h-[46px] px-6 text-[15px]"
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
