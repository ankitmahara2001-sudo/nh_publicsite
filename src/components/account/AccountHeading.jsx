/** H1 of an account page (inner-page scale, smaller than a hero heading). */
export function AccountHeading({ id, children }) {
  return (
    <h1
      id={id}
      className="text-[28px] leading-9 font-extrabold tracking-[-0.6px] lg:text-[36px] lg:leading-[44px] lg:tracking-[-1px]"
    >
      {children}
    </h1>
  );
}
