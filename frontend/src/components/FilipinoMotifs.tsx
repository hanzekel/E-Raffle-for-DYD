// frontend/src/components/FilipinoMotifs.tsx
// Vector SVG Christmas holiday motifs: 3D curved satin corner ribbons, button curls, ornaments, pines & sleigh
import React, { useId } from 'react';

interface SatinPatternDefsProps {
  patternId: string;
  gradId: string;
  scale?: number;
}

// Reusable SVG defs for glossy crimson-red Christmas satin ribbon with metallic gold trim & pine accent
const ChristmasSatinDefs: React.FC<SatinPatternDefsProps> = ({ patternId, gradId, scale = 1 }) => (
  <defs>
    <pattern
      id={patternId}
      width={64 * scale}
      height={38 * scale}
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(-38)"
    >
      {/* Metallic gold outer stitched edges */}
      <rect width={64 * scale} height={38 * scale} fill="#F5A623" />
      {/* Evergreen pine inner trim line */}
      <rect y={2.5 * scale} width={64 * scale} height={33 * scale} fill="#166534" />
      <rect y={5 * scale} width={64 * scale} height={28 * scale} fill="#C81D25" />

      {/* Dashed gold satin stitching */}
      <line
        x1="0"
        y1={7 * scale}
        x2={64 * scale}
        y2={7 * scale}
        stroke="#FDE68A"
        strokeWidth={1.1 * scale}
        strokeDasharray={`${4 * scale} ${3 * scale}`}
      />
      <line
        x1="0"
        y1={31 * scale}
        x2={64 * scale}
        y2={31 * scale}
        stroke="#FDE68A"
        strokeWidth={1.1 * scale}
        strokeDasharray={`${4 * scale} ${3 * scale}`}
      />

      {/* Twinkling snowflake / holiday star accents along the satin band */}
      <path
        d={`M${16 * scale} ${14 * scale} L${17.5 * scale} ${18 * scale} L${21.5 * scale} ${19 * scale} L${17.5 * scale} ${20 * scale} L${16 * scale} ${24 * scale} L${14.5 * scale} ${20 * scale} L${10.5 * scale} ${19 * scale} L${14.5 * scale} ${18 * scale} Z`}
        fill="#FDE68A"
        fillOpacity="0.88"
      />
      <circle cx={46 * scale} cy={19 * scale} r={2 * scale} fill="#FFFFFF" fillOpacity="0.8" />
    </pattern>

    {/* 3D satin specular highlight & crease depth along curved fold */}
    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
      <stop offset="36%" stopColor="#FFFFFF" stopOpacity="0.24" />
      <stop offset="56%" stopColor="#FFFFFF" stopOpacity="0.06" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
    </linearGradient>
  </defs>
);

interface ChristmasCornerRibbonsProps {
  size?: 'sm' | 'md' | 'lg';
  showBottomRight?: boolean;
}

// 3D curved Christmas satin ribbons curling around top-left and bottom-right corners
export const ChristmasCornerRibbons: React.FC<ChristmasCornerRibbonsProps> = ({
  size = 'md',
  showBottomRight = true,
}) => {
  const uid = useId().replace(/:/g, '');
  const patId = `xmas-pat-${uid}`;
  const sheenId = `xmas-sheen-${uid}`;

  const sizeClass =
    size === 'sm'
      ? 'w-14 h-14 sm:w-16 sm:h-16'
      : size === 'lg'
        ? 'w-28 h-28 sm:w-36 sm:h-36'
        : 'w-20 h-20 sm:w-24 sm:h-24';

  const patScale = size === 'sm' ? 0.45 : size === 'lg' ? 0.68 : 0.56;

  return (
    <>
      <svg
        viewBox="0 0 120 120"
        className={`${sizeClass} absolute -top-2 -left-2 pointer-events-none z-20 drop-shadow-[0_6px_10px_rgba(13,31,92,0.28)]`}
        fill="none"
        aria-hidden="true"
      >
        <ChristmasSatinDefs patternId={patId} gradId={sheenId} scale={patScale} />
        <path d="M8 82 C2 92, 6 104, 14 108 L18 88 Z" fill="#4C0519" />
        <path d="M86 6 C96 2, 106 6, 110 14 L88 16 Z" fill="#4C0519" />
        <path
          d="M8 82 C10 46, 38 14, 86 6 L102 18 L86 24 C54 30, 32 54, 18 88 L8 82 Z"
          fill={`url(#${patId})`}
        />
        <path
          d="M8 82 C10 46, 38 14, 86 6 L102 18 L86 24 C54 30, 32 54, 18 88 L8 82 Z"
          fill={`url(#${sheenId})`}
        />
        <path
          d="M9 81 C11 46, 39 15, 86 7 M19 87 C33 55, 55 31, 86 24"
          stroke="#FDE68A"
          strokeWidth="1.4"
          strokeOpacity="0.9"
        />
      </svg>

      {showBottomRight && (
        <svg
          viewBox="0 0 120 120"
          className={`${sizeClass} absolute -bottom-2 -right-2 pointer-events-none z-20 drop-shadow-[0_6px_10px_rgba(13,31,92,0.28)]`}
          fill="none"
          aria-hidden="true"
        >
          <ChristmasSatinDefs patternId={`${patId}-br`} gradId={`${sheenId}-br`} scale={patScale} />
          <path d="M34 114 C24 118, 14 114, 10 106 L32 104 Z" fill="#4C0519" />
          <path d="M112 38 C118 28, 114 16, 106 12 L102 32 Z" fill="#4C0519" />
          <path
            d="M112 38 C110 74, 82 106, 34 114 L18 102 L34 96 C66 90, 88 66, 102 32 L112 38 Z"
            fill={`url(#${patId}-br)`}
          />
          <path
            d="M112 38 C110 74, 82 106, 34 114 L18 102 L34 96 C66 90, 88 66, 102 32 L112 38 Z"
            fill={`url(#${sheenId}-br)`}
          />
          <path
            d="M111 39 C109 74, 81 105, 34 113 M101 33 C87 65, 65 89, 34 96"
            stroke="#FDE68A"
            strokeWidth="1.4"
            strokeOpacity="0.9"
          />
        </svg>
      )}
    </>
  );
};

interface ChristmasButtonWrapProps {
  children: React.ReactNode;
  className?: string;
}

// Wraps main-page CTA buttons with festive mini 3D Christmas satin corner curls
export const ChristmasButtonWrap: React.FC<ChristmasButtonWrapProps> = ({ children, className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const patId = `xmas-btn-${uid}`;
  const sheenId = `xmas-btn-sh-${uid}`;

  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      <svg
        viewBox="0 0 64 48"
        className="w-8 h-6 sm:w-9 sm:h-7 absolute -top-1.5 -left-1.5 pointer-events-none z-20 drop-shadow-[0_3px_5px_rgba(13,31,92,0.3)]"
        fill="none"
        aria-hidden="true"
      >
        <ChristmasSatinDefs patternId={patId} gradId={sheenId} scale={0.35} />
        <path d="M5 34 C1 40, 4 45, 9 46 L11 36 Z" fill="#4C0519" />
        <path
          d="M5 34 C7 17, 22 6, 46 3 L54 10 L44 13 C27 16, 17 25, 11 36 L5 34 Z"
          fill={`url(#${patId})`}
        />
        <path
          d="M5 34 C7 17, 22 6, 46 3 L54 10 L44 13 C27 16, 17 25, 11 36 L5 34 Z"
          fill={`url(#${sheenId})`}
        />
        <path d="M6 33 C8 17, 22 7, 46 4" stroke="#FDE68A" strokeWidth="1.2" />
      </svg>

      <svg
        viewBox="0 0 64 48"
        className="w-8 h-6 sm:w-9 sm:h-7 absolute -bottom-1.5 -right-1.5 pointer-events-none z-20 drop-shadow-[0_3px_5px_rgba(13,31,92,0.3)]"
        fill="none"
        aria-hidden="true"
      >
        <ChristmasSatinDefs patternId={`${patId}-br`} gradId={`${sheenId}-br`} scale={0.35} />
        <path d="M59 14 C63 8, 60 3, 55 2 L53 12 Z" fill="#4C0519" />
        <path
          d="M59 14 C57 31, 42 42, 18 45 L10 38 L20 35 C37 32, 47 23, 53 12 L59 14 Z"
          fill={`url(#${patId}-br)`}
        />
        <path
          d="M59 14 C57 31, 42 42, 18 45 L10 38 L20 35 C37 32, 47 23, 53 12 L59 14 Z"
          fill={`url(#${sheenId}-br)`}
        />
        <path d="M58 15 C56 31, 42 41, 18 44" stroke="#FDE68A" strokeWidth="1.2" />
      </svg>
    </div>
  );
};

// Gentle crisp SVG snowfall backdrop for hero winter sky
export const WinterSnowflakesOverlay: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 600 260"
    preserveAspectRatio="xMidYMid slice"
    className={`pointer-events-none select-none ${className}`}
    fill="none"
    aria-hidden="true"
  >
    {[
      [42, 30, 3], [98, 72, 2], [164, 24, 2.5], [220, 62, 3.5], [285, 36, 2],
      [340, 82, 2.5], [412, 28, 3], [468, 66, 2], [530, 42, 3.5], [575, 88, 2.5],
      [68, 134, 2.5], [135, 165, 2], [248, 128, 2], [392, 140, 3], [495, 124, 2.5],
      [554, 155, 2],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#FFFFFF" fillOpacity={i % 2 === 0 ? 0.78 : 0.5} />
    ))}
    {/* Soft snowy ground drift hills along the bottom edge */}
    <path
      d="M0 228 Q 140 198, 300 222 T 600 214 L 600 260 L 0 260 Z"
      fill="#FFFFFF"
      fillOpacity="0.92"
    />
    <path
      d="M0 242 Q 180 216, 360 236 T 600 228 L 600 260 L 0 260 Z"
      fill="#F8FAFC"
    />
  </svg>
);

// Pine trees, wrapped gifts & Philippine Parol star illustration inspired by festive storybook layout
export const PineTreeGiftsArt: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 260 170" className={className} fill="none" aria-hidden="true">
    {/* Soft sky circle behind trees */}
    <circle cx="132" cy="86" r="70" fill="#E0F2FE" />
    {/* Back pine trees */}
    <polygon points="75,40 45,125 105,125" fill="#1E6B3A" />
    <polygon points="185,48 156,125 214,125" fill="#15803D" />
    {/* Main decorated Christmas tree */}
    <rect x="124" y="122" width="12" height="18" rx="2" fill="#78350F" />
    <polygon points="130,20 88,78 172,78" fill="#166534" />
    <polygon points="130,44 80,104 180,104" fill="#15803D" />
    <polygon points="130,68 72,126 188,126" fill="#16A34A" />
    {/* Parol star topper */}
    <polygon
      points="130,6 133,15 142,15 135,20 137,29 130,24 123,29 125,20 118,15 127,15"
      fill="#F5A623"
    />
    {/* Colorful ornaments */}
    <circle cx="118" cy="64" r="4" fill="#E63030" />
    <circle cx="144" cy="70" r="3.5" fill="#FDE68A" />
    <circle cx="106" cy="92" r="4.5" fill="#F5A623" />
    <circle cx="134" cy="96" r="4" fill="#E63030" />
    <circle cx="156" cy="112" r="4" fill="#38BDF8" />
    <circle cx="100" cy="115" r="3.5" fill="#FDE68A" />
    {/* Gift boxes beneath tree */}
    <rect x="64" y="122" width="26" height="22" rx="3" fill="#C81D25" />
    <rect x="74" y="122" width="6" height="22" fill="#F5A623" />
    <rect x="64" y="130" width="26" height="5" fill="#F5A623" />

    <rect x="166" y="120" width="30" height="24" rx="3" fill="#1A3A8F" />
    <rect x="178" y="120" width="6" height="24" fill="#FFFFFF" />
    <rect x="166" y="129" width="30" height="5" fill="#FFFFFF" />

    <rect x="108" y="126" width="24" height="18" rx="3" fill="#F5A623" />
    <rect x="117" y="126" width="5" height="18" fill="#C81D25" />
    {/* Snow hill base */}
    <path d="M20 144 Q 130 134, 240 144 L 240 165 L 20 165 Z" fill="#FFFFFF" />
  </svg>
);

// Hanging Christmas ornaments garland for dark twilight header/countdown panel
export const OrnamentGarland: React.FC<{ className?: string }> = ({ className = 'w-full h-14' }) => (
  <svg viewBox="0 0 320 60" className={className} fill="none" aria-hidden="true">
    {/* String cord */}
    <path d="M0 4 Q 160 12, 320 4" stroke="#FDE68A" strokeWidth="1.2" strokeOpacity="0.6" />
    {/* Hanging Ornament 1: Red Bauble */}
    <line x1="42" y1="6" x2="42" y2="24" stroke="#CBD5E1" strokeWidth="1" />
    <circle cx="42" cy="34" r="10" fill="#E63030" />
    <path d="M36 32 Q 42 36, 48 32" stroke="#FDE68A" strokeWidth="1.5" />
    {/* Hanging Ornament 2: Snowflake Star */}
    <line x1="106" y1="7" x2="106" y2="20" stroke="#CBD5E1" strokeWidth="1" />
    <polygon points="106,18 109,25 116,25 111,29 113,36 106,32 99,36 101,29 96,25 103,25" fill="#F5A623" />
    {/* Hanging Ornament 3: Pine & Gold Gift */}
    <line x1="176" y1="8" x2="176" y2="24" stroke="#CBD5E1" strokeWidth="1" />
    <rect x="166" y="24" width="20" height="18" rx="3" fill="#16A34A" />
    <rect x="174" y="24" width="4" height="18" fill="#F5A623" />
    {/* Hanging Ornament 4: Gold Bell */}
    <line x1="242" y1="6" x2="242" y2="22" stroke="#CBD5E1" strokeWidth="1" />
    <path d="M232 38 C232 26, 252 26, 252 38 L254 42 H230 Z" fill="#F5A623" />
    <circle cx="242" cy="43" r="2.5" fill="#FDE68A" />
    {/* Hanging Ornament 5: Blue Bauble */}
    <line x1="292" y1="5" x2="292" y2="26" stroke="#CBD5E1" strokeWidth="1" />
    <circle cx="292" cy="34" r="8" fill="#5BB8F5" />
  </svg>
);

// Subtle sleigh silhouette for the festive crimson countdown strip
export const SleighSilhouette: React.FC<{ className?: string }> = ({ className = 'w-28 h-10' }) => (
  <svg viewBox="0 0 180 56" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18 38 C24 38, 30 34, 34 26 L56 26 C58 34, 64 38, 70 38 L74 44 L16 44 Z" />
    <path d="M12 46 Q 44 50, 78 44" stroke="currentColor" strokeWidth="2.5" fill="none" />
    {/* Reindeer */}
    <ellipse cx="112" cy="32" rx="10" ry="5" />
    <circle cx="122" cy="24" r="4" />
    <line x1="106" y1="36" x2="102" y2="45" stroke="currentColor" strokeWidth="2" />
    <line x1="118" y1="36" x2="122" y2="45" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="146" cy="28" rx="10" ry="5" />
    <circle cx="156" cy="20" r="4" />
    <line x1="140" y1="32" x2="136" y2="41" stroke="currentColor" strokeWidth="2" />
    <line x1="152" y1="32" x2="156" y2="41" stroke="currentColor" strokeWidth="2" />
    {/* Reins */}
    <path d="M56 26 Q 98 30, 152 22" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.6" />
  </svg>
);
