/** H1 of an account page (inner-page scale, smaller than a hero heading). */
export function AccountHeading({ id, children }) {
  return (
    <h1 id={id} className="text-[26px] leading-[1.1] lg:text-[34px]">
      {children}
    </h1>
  );
}
