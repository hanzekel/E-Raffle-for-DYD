// frontend/src/components/FilipinoMotifs.tsx
// Vector SVG seasonal motifs: winter snowfall, pine trees with gift boxes & garland ornaments
import React from 'react';

// Gentle crisp SVG snowfall backdrop & snowbank horizon for hero sky
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

// Pine trees, wrapped prize boxes & Parol star illustration
export const PineTreeGiftsArt: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 260 170" className={className} fill="none" aria-hidden="true">
    <circle cx="132" cy="86" r="70" fill="#E0F2FE" />
    <polygon points="75,40 45,125 105,125" fill="#1E6B3A" />
    <polygon points="185,48 156,125 214,125" fill="#15803D" />
    <rect x="124" y="122" width="12" height="18" rx="2" fill="#78350F" />
    <polygon points="130,20 88,78 172,78" fill="#166534" />
    <polygon points="130,44 80,104 180,104" fill="#15803D" />
    <polygon points="130,68 72,126 188,126" fill="#16A34A" />
    <polygon
      points="130,6 133,15 142,15 135,20 137,29 130,24 123,29 125,20 118,15 127,15"
      fill="#F5A623"
    />
    <circle cx="118" cy="64" r="4" fill="#E63030" />
    <circle cx="144" cy="70" r="3.5" fill="#FDE68A" />
    <circle cx="106" cy="92" r="4.5" fill="#F5A623" />
    <circle cx="134" cy="96" r="4" fill="#E63030" />
    <circle cx="156" cy="112" r="4" fill="#38BDF8" />
    <circle cx="100" cy="115" r="3.5" fill="#FDE68A" />
    <rect x="64" y="122" width="26" height="22" rx="3" fill="#C81D25" />
    <rect x="74" y="122" width="6" height="22" fill="#F5A623" />
    <rect x="64" y="130" width="26" height="5" fill="#F5A623" />

    <rect x="166" y="120" width="30" height="24" rx="3" fill="#1A3A8F" />
    <rect x="178" y="120" width="6" height="24" fill="#FFFFFF" />
    <rect x="166" y="129" width="30" height="5" fill="#FFFFFF" />

    <rect x="108" y="126" width="24" height="18" rx="3" fill="#F5A623" />
    <rect x="117" y="126" width="5" height="18" fill="#C81D25" />
    <path d="M20 144 Q 130 134, 240 144 L 240 165 L 20 165 Z" fill="#FFFFFF" />
  </svg>
);

// Hanging decorative garland for dark twilight countdown panel
export const OrnamentGarland: React.FC<{ className?: string }> = ({ className = 'w-full h-14' }) => (
  <svg viewBox="0 0 320 60" className={className} fill="none" aria-hidden="true">
    <path d="M0 4 Q 160 12, 320 4" stroke="#FDE68A" strokeWidth="1.2" strokeOpacity="0.6" />
    <line x1="42" y1="6" x2="42" y2="24" stroke="#CBD5E1" strokeWidth="1" />
    <circle cx="42" cy="34" r="10" fill="#E63030" />
    <path d="M36 32 Q 42 36, 48 32" stroke="#FDE68A" strokeWidth="1.5" />
    <line x1="106" y1="7" x2="106" y2="20" stroke="#CBD5E1" strokeWidth="1" />
    <polygon points="106,18 109,25 116,25 111,29 113,36 106,32 99,36 101,29 96,25 103,25" fill="#F5A623" />
    <line x1="176" y1="8" x2="176" y2="24" stroke="#CBD5E1" strokeWidth="1" />
    <rect x="166" y="24" width="20" height="18" rx="3" fill="#16A34A" />
    <rect x="174" y="24" width="4" height="18" fill="#F5A623" />
    <line x1="242" y1="6" x2="242" y2="22" stroke="#CBD5E1" strokeWidth="1" />
    <path d="M232 38 C232 26, 252 26, 252 38 L254 42 H230 Z" fill="#F5A623" />
    <circle cx="242" cy="43" r="2.5" fill="#FDE68A" />
    <line x1="292" y1="5" x2="292" y2="26" stroke="#CBD5E1" strokeWidth="1" />
    <circle cx="292" cy="34" r="8" fill="#5BB8F5" />
  </svg>
);
