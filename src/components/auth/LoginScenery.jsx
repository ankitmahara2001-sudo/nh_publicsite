import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';

const STARS = [
  [80, 120, 1.6],
  [160, 220, 1.1],
  [240, 90, 1.4],
  [330, 180, 1],
  [420, 70, 1.6],
  [500, 240, 1.1],
  [620, 150, 1.5],
  [680, 300, 1],
  [60, 330, 1],
  [380, 300, 1.2],
  [560, 360, 1],
  [200, 400, 1.1],
];

/** Illustrated night over the Kumaon hills (design: Login scenic pane). Decorative only. */
function NightHills() {
  return (
    <svg
      viewBox="0 0 720 960"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="login-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#121a30" />
          <stop offset=".6" stopColor="#2c3557" />
          <stop offset="1" stopColor="#6a4f63" />
        </linearGradient>
      </defs>
      <rect width="720" height="960" fill="url(#login-night)" />
      <g fill="#f8ecd0">
        {STARS.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <circle cx="540" cy="200" r="46" fill="#f8ecd0" />
      <circle cx="558" cy="190" r="42" fill="#1a2440" />
      <path
        d="M0 640 L80 560 L140 590 L240 450 L300 510 L360 470 L430 540 L520 430 L590 500 L650 470 L720 520 L720 960 L0 960 Z"
        fill="#3a4466"
      />
      <path
        d="M240 450 L268 488 L256 482 L244 494 L232 484 L218 490 L206 488 Z M520 430 L548 466 L536 461 L524 472 L512 462 L498 468 L488 466 Z"
        fill="#dfe4ee"
      />
      <path
        d="M0 960 L0 700 L120 670 L240 690 L360 650 L480 680 L600 655 L720 670 L720 960 Z"
        fill="#26304a"
      />
      <path
        d="M0 960 L0 780 L14 740 L26 780 L36 730 L48 780 L58 745 L70 780 L84 720 L98 780 L110 750 L122 780 L136 735 L150 780 L160 752 L172 780 L186 726 L200 780 L212 748 L224 780 L238 738 L252 780 L262 756 L274 780 L288 730 L302 780 L314 750 L326 780 L340 728 L354 780 L366 752 L378 780 L392 736 L406 780 L418 748 L430 780 L444 730 L458 780 L470 756 L482 780 L496 734 L510 780 L522 750 L534 780 L548 726 L562 780 L574 752 L586 780 L600 738 L614 780 L626 754 L638 780 L652 732 L666 780 L678 750 L690 780 L704 740 L720 780 L720 960 Z"
        fill="#141d2b"
      />
      <g fill="#f2b46a">
        <rect x="300" y="800" width="26" height="18" rx="2" />
        <path d="M296 802 L313 786 L330 802 Z" />
      </g>
      <path d="M313 818 L313 840" stroke="#f2b46a" strokeWidth="2" opacity=".6" />
      <path
        d="M420 260c6-5 12-5 17 1 5-6 11-6 17-1"
        stroke="#f5f1e8"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity=".8"
      />
    </svg>
  );
}

/** "Yatra pass" boarding-pass card: Kathgodam → Nainital, with a marigold barcode stub. */
function BoardingPass() {
  return (
    <div className="mt-2.5 flex overflow-hidden rounded-[18px] bg-page text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,.7)]">
      <div className="flex flex-1 flex-col gap-2.5 px-5 py-[18px]">
        <span className="text-[11px] font-bold tracking-[.2em] text-pine uppercase">Yatra pass</span>
        <div className="flex items-center gap-3">
          <span className="flex flex-col leading-[1.1]">
            <span className="font-display text-[22px]">KGM</span>
            <span className="text-xs text-muted">Kathgodam</span>
          </span>
          <svg width="70" height="16" viewBox="0 0 70 16" fill="none" aria-hidden="true">
            <path d="M2 8 H60" stroke="#12261f" strokeWidth="1.5" strokeDasharray="3 4" />
            <path d="M56 3 L64 8 L56 13" stroke="#12261f" strokeWidth="1.5" />
          </svg>
          <span className="flex flex-col leading-[1.1]">
            <span className="font-display text-[22px]">NTL</span>
            <span className="text-xs text-muted">Nainital</span>
          </span>
        </div>
        <span className="text-[13px] text-muted">Your bookings · payments · trip details</span>
      </div>
      <div className="flex w-24 shrink-0 items-center justify-center border-l-2 border-dashed border-[#c9bfa8] bg-gold">
        <svg width="40" height="64" viewBox="0 0 40 64" aria-hidden="true">
          <g fill="#12261f">
            <rect x="2" y="2" width="3" height="60" />
            <rect x="8" y="2" width="1.5" height="60" />
            <rect x="12" y="2" width="4" height="60" />
            <rect x="19" y="2" width="1.5" height="60" />
            <rect x="23" y="2" width="3" height="60" />
            <rect x="29" y="2" width="1.5" height="60" />
            <rect x="33" y="2" width="4" height="60" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/** Scenic side of the login page: night hills, logo, Kalam greeting and the boarding pass (desktop). */
export function LoginScenery({ companyName }) {
  return (
    <aside className="relative flex h-[340px] shrink-0 flex-col overflow-hidden bg-night text-page lg:h-auto lg:min-h-svh lg:flex-1 lg:justify-between lg:px-12 lg:pt-9 lg:pb-12">
      <NightHills />

      {/* Phones: back button + name, then the short title. */}
      <div className="relative flex items-center justify-between px-4 py-3.5 lg:hidden">
        <Link
          href="/"
          aria-label="Back to home"
          className="flex size-11 items-center justify-center rounded-full border border-page/35"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <span className="font-display text-lg">{companyName}</span>
        <span className="w-11" />
      </div>
      <div className="relative px-6 pt-5 lg:hidden">
        <span className="font-hand text-xl text-gold-light">phir milenge pahadon mein</span>
        <p className="font-display text-[28px] leading-[1.05]">Your trips, one tap away</p>
      </div>

      {/* Desktop: logo on top, greeting and boarding pass at the bottom. */}
      <div className="relative hidden lg:block">
        <Logo name={companyName} tone="light" />
      </div>
      <div className="relative hidden max-w-[460px] flex-col gap-[18px] lg:flex">
        <span className="font-hand text-[22px] text-gold-light">phir milenge pahadon mein</span>
        <p className="font-display text-[clamp(28px,2.8vw,38px)] leading-[1.05]">
          Your trips, saved like a boarding pass.
        </p>
        <BoardingPass />
      </div>
    </aside>
  );
}
