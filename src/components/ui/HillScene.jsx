import { cn } from '@/lib/cn';

// Lightweight illustrated stand-in for a missing photo: layered Kumaon ridges, snow caps, a sun or
// moon and a deodar treeline, drawn inline (no download). One palette per page mood.
// No SVG ids are used (the sky is a CSS gradient), so any number of scenes can share a page.
const THEMES = {
  dawn: {
    sky: 'linear-gradient(180deg, #f7d9a6 0%, #e9a46c 100%)',
    sun: '#fff4dc',
    far: '#c9d3de',
    mid: '#7c93a8',
    near: '#2b5243',
    trees: '#12261f',
  },
  mist: {
    sky: 'linear-gradient(180deg, #d3dfec 0%, #93aac6 100%)',
    sun: '#f4f7fb',
    far: '#e3e9f0',
    mid: '#6f87a3',
    near: '#3c5a73',
    trees: '#1d3d32',
  },
  sunset: {
    sky: 'linear-gradient(180deg, #f3c194 0%, #cf7b78 100%)',
    sun: '#fde3bf',
    far: '#c7b6c3',
    mid: '#7e6f86',
    near: '#4c4a5e',
    trees: '#1d2b2a',
  },
  forest: {
    sky: 'linear-gradient(180deg, #ece6c6 0%, #bcc79c 100%)',
    sun: '#fff3d1',
    far: '#b9c4b8',
    mid: '#8fb093',
    near: '#4c6b4f',
    trees: '#1d3d32',
  },
  night: {
    sky: 'linear-gradient(180deg, #121a30 0%, #2c3557 60%, #6a4f63 100%)',
    sun: '#f8ecd0',
    far: '#3a4466',
    mid: '#2c3655',
    near: '#26304a',
    trees: '#141d2b',
  },
};

// A deodar treeline: alternating tall and short tips along the bottom.
const TREELINE = `M0 900 L0 740 ${Array.from({ length: 49 }, (_, i) => {
  const x = i * 30;
  const tip = 650 + ((i * 37) % 60);
  return `L${x + 15} ${tip} L${x + 30} 740`;
}).join(' ')} L1440 900 Z`;

/**
 * Full-bleed illustrated scene that fills its positioned parent.
 * `theme`: dawn (default) · mist · sunset · forest · night.
 */
export function HillScene({ theme = 'dawn', className }) {
  const t = THEMES[theme] ?? THEMES.dawn;
  const night = theme === 'night';
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={cn('absolute inset-0 h-full w-full', className)}
      style={{ background: t.sky }}
    >
      {night ? (
        <>
          <g fill="#f8ecd0">
            <circle cx="160" cy="120" r="1.8" />
            <circle cx="420" cy="80" r="1.4" />
            <circle cx="640" cy="170" r="1.6" />
            <circle cx="860" cy="70" r="1.2" />
            <circle cx="1240" cy="150" r="1.6" />
            <circle cx="300" cy="260" r="1.2" />
            <circle cx="1340" cy="280" r="1.3" />
          </g>
          <circle cx="1060" cy="220" r="56" fill={t.sun} />
          <circle cx="1082" cy="208" r="50" fill="#1a2440" />
        </>
      ) : (
        <>
          <circle cx="1060" cy="260" r="120" fill={t.sun} opacity=".25" />
          <circle cx="1060" cy="260" r="68" fill={t.sun} opacity=".9" />
        </>
      )}
      <path
        d="M0 470 L90 380 L150 410 L250 280 L300 320 L360 250 L420 330 L480 300 L560 380 L640 310 L720 220 L790 300 L850 270 L930 350 L1010 290 L1090 200 L1160 280 L1220 260 L1300 340 L1380 300 L1440 350 L1440 900 L0 900 Z"
        fill={t.far}
      />
      <path
        d="M720 220 L755 260 L742 254 L730 266 L718 255 L704 264 L684 260 Z M1090 200 L1125 240 L1112 234 L1100 246 L1088 235 L1074 244 L1054 240 Z M360 250 L390 290 L378 284 L366 296 L354 286 L343 292 L326 290 Z"
        fill={night ? '#dfe4ee' : '#fbfaf6'}
      />
      <path
        d="M0 560 L120 520 L240 545 L380 500 L520 540 L660 505 L800 535 L940 495 L1080 530 L1220 500 L1340 525 L1440 510 L1440 900 L0 900 Z"
        fill={t.mid}
      />
      <path
        d="M0 650 L160 615 L320 640 L480 605 L640 635 L800 600 L960 630 L1120 598 L1280 625 L1440 605 L1440 900 L0 900 Z"
        fill={t.near}
      />
      <path d={TREELINE} fill={t.trees} />
      <path
        d="M980 330c6-5 12-5 17 1 5-6 11-6 17-1M1035 362c4-3 8-3 11 1 3-4 7-4 11-1"
        stroke={night ? '#f5f1e8' : '#12261f'}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  );
}
