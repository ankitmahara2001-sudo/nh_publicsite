'use client';

import { useEffect, useRef } from 'react';

/**
 * Title + intro of a login step, with an optional handwritten Kalam greeting above it
 * (design: Login "swagat hai, wapas —"). With `focusOnMount` the heading takes focus when the step
 * appears, so screen-reader and keyboard users land on the new step.
 */
export function StepHeading({ title, aside, children, focusOnMount = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);

  return (
    <div className="mb-6 flex flex-col gap-1.5">
      {aside && <span className="font-hand text-[20px] leading-snug text-gold-text">{aside}</span>}
      <h1 ref={ref} tabIndex={-1} className="text-[24px] leading-[1.05] outline-none lg:text-[32px]">
        {title}
      </h1>
      {children && <p className="mt-1 text-[15px] leading-6 text-muted">{children}</p>}
    </div>
  );
}
