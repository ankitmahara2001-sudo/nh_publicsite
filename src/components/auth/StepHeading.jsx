'use client';

import { useEffect, useRef } from 'react';

/**
 * Title + intro of a login step. With `focusOnMount` the heading takes focus when the step
 * appears, so screen-reader and keyboard users land on the new step.
 */
export function StepHeading({ title, children, focusOnMount = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);

  return (
    <div className="mb-6 flex flex-col gap-2">
      <h1
        ref={ref}
        tabIndex={-1}
        className="text-2xl leading-8 font-extrabold tracking-[-0.5px] outline-none lg:text-[28px] lg:leading-9"
      >
        {title}
      </h1>
      {children && <p className="text-[15px] leading-6 text-body">{children}</p>}
    </div>
  );
}
