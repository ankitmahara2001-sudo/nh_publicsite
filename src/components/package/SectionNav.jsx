'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Sticky "On this page" links under the package hero (design/PackageDetail.dc.html).
 * The link of the section in view gets the gold underline.
 */
export function SectionNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-20 hidden border-b border-line bg-surface lg:block"
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-9 px-20">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? 'true' : undefined}
            className={cn(
              'border-b-2 py-5 text-[15px] transition',
              active === id
                ? 'border-gold font-bold text-ink'
                : 'border-transparent font-semibold text-muted hover:text-ink',
            )}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
