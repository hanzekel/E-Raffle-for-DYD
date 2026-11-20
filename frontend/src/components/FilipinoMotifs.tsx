// Philippine cultural SVG motifs: 3D curved Sablay corner ribbons, button curls & 8-ray Philippine sun
import React, { useId } from 'react';

interface SablayPatternDefsProps {
  patternId: string;
  gradId: string;
  scale?: number;
}

// Reusable SVG defs rendering authentic Filipino Sablay fabric: crimson center, Baybayin gold motifs & woven ethnic borders
const SablayPatternDefs: React.FC<SablayPatternDefsProps> = ({ patternId, gradId, scale = 1 }) => (
  <defs>
    <pattern
      id={patternId}
      width={68 * scale}
      height={40 * scale}
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(-38)"
    >
      {/* Outer Sablay emerald & gold border selvedge */}
      <rect width={68 * scale} height={40 * scale} fill="#166534" />
      <rect y={2.5 * scale} width={68 * scale} height={35 * scale} fill="#1A3A8F" />

      {/* Geometric woven diamond/zigzag borders top & bottom */}
      <path
        d={`M0 ${4.5 * scale} L${8.5 * scale} ${8.5 * scale} L${17 * scale} ${4.5 * scale} L${25.5 * scale} ${8.5 * scale} L${34 * scale} ${4.5 * scale} L${42.5 * scale} ${8.5 * scale} L${51 * scale} ${4.5 * scale} L${59.5 * scale} ${8.5 * scale} L${68 * scale} ${4.5 * scale}`}
        stroke="#F5A623"
        strokeWidth={1.6 * scale}
        fill="none"
      />
      <path
        d={`M0 ${35.5 * scale} L${8.5 * scale} ${31.5 * scale} L${17 * scale} ${35.5 * scale} L${25.5 * scale} ${31.5 * scale} L${34 * scale} ${35.5 * scale} L${42.5 * scale} ${31.5 * scale} L${51 * scale} ${35.5 * scale} L${59.5 * scale} ${31.5 * scale} L${68 * scale} ${35.5 * scale}`}
        stroke="#F5A623"
        strokeWidth={1.6 * scale}
        fill="none"
      />
      <line x1="0" y1={9.5 * scale} x2={68 * scale} y2={9.5 * scale} stroke="#FFFFFF" strokeWidth={0.9 * scale} strokeOpacity="0.85" />
      <line x1="0" y1={30.5 * scale} x2={68 * scale} y2={30.5 * scale} stroke="#FFFFFF" strokeWidth={0.9 * scale} strokeOpacity="0.85" />

      {/* Crimson maroon woven center band */}
      <rect y={10.2 * scale} width={68 * scale} height={19.6 * scale} fill="#A61C28" />

      {/* Repeating Baybayin-inspired golden ethnic calligraphy flourishes */}
      <path
        d={`M${9 * scale} ${22 * scale} C${13 * scale} ${15 * scale}, ${19 * scale} ${15 * scale}, ${23 * scale} ${21 * scale} M${16 * scale} ${17 * scale} C${15 * scale} ${22 * scale}, ${19 * scale} ${25 * scale}, ${24 * scale} ${23 * scale}`}
        stroke="#F5A623"
        strokeWidth={2 * scale}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${40 * scale} ${22 * scale} C${44 * scale} ${15 * scale}, ${50 * scale} ${15 * scale}, ${54 * scale} ${21 * scale} M${47 * scale} ${17 * scale} C${46 * scale} ${22 * scale}, ${50 * scale} ${25 * scale}, ${55 * scale} ${23 * scale}`}
        stroke="#FCD34D"
        strokeWidth={2 * scale}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={32 * scale} cy={20 * scale} r={1.8 * scale} fill="#F5A623" />
      <circle cx={63 * scale} cy={20 * scale} r={1.8 * scale} fill="#F5A623" />
    </pattern>

    {/* 3D satin highlight & depth shading along curved ribbon */}
    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
      <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.18" />
      <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.06" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
    </linearGradient>
  </defs>
);

interface SablayCornerRibbonsProps {
  size?: 'sm' | 'md' | 'lg';
  showBottomRight?: boolean;
}

// 3D curved Sablay ribbon sashes wrapping around top-left and bottom-right corners like draped fabric
export const SablayCornerRibbons: React.FC<SablayCornerRibbonsProps> = ({
  size = 'md',
  showBottomRight = true,
}) => {
  const uid = useId().replace(/:/g, '');
  const patId = `sablay-pat-${uid}`;
  const sheenId = `sablay-sheen-${uid}`;

  const sizeClass =
    size === 'sm'
      ? 'w-14 h-14 sm:w-16 sm:h-16'
      : size === 'lg'
        ? 'w-28 h-28 sm:w-36 sm:h-36'
        : 'w-20 h-20 sm:w-24 sm:h-24';

  const patScale = size === 'sm' ? 0.45 : size === 'lg' ? 0.68 : 0.56;

  return (
    <>
      {/* Top-Left 3D Curved Sablay Sash */}
      <svg
        viewBox="0 0 120 120"
        className={`${sizeClass} absolute -top-2 -left-2 pointer-events-none z-20 drop-shadow-[0_6px_10px_rgba(13,31,92,0.3)]`}
        fill="none"
        aria-hidden="true"
      >
        <SablayPatternDefs patternId={patId} gradId={sheenId} scale={patScale} />
        {/* Underside dark fold tucking behind left edge */}
        <path d="M8 82 C2 92, 6 104, 14 108 L18 88 Z" fill="#3B0A10" />
        {/* Underside dark fold tucking behind top edge */}
        <path d="M86 6 C96 2, 106 6, 110 14 L88 16 Z" fill="#3B0A10" />
        {/* Main curved 3D ribbon sweeping across top-left corner with swallowtail tip */}
        <path
          d="M8 82 C10 46, 38 14, 86 6 L102 18 L86 24 C54 30, 32 54, 18 88 L8 82 Z"
          fill={`url(#${patId})`}
        />
        <path
          d="M8 82 C10 46, 38 14, 86 6 L102 18 L86 24 C54 30, 32 54, 18 88 L8 82 Z"
          fill={`url(#${sheenId})`}
        />
        {/* Crisp gold edge highlight */}
        <path
          d="M9 81 C11 46, 39 15, 86 7 M19 87 C33 55, 55 31, 86 24"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeOpacity="0.9"
        />
      </svg>

      {/* Bottom-Right 3D Curved Sablay Sash */}
      {showBottomRight && (
        <svg
          viewBox="0 0 120 120"
          className={`${sizeClass} absolute -bottom-2 -right-2 pointer-events-none z-20 drop-shadow-[0_6px_10px_rgba(13,31,92,0.3)]`}
          fill="none"
          aria-hidden="true"
        >
          <SablayPatternDefs patternId={`${patId}-br`} gradId={`${sheenId}-br`} scale={patScale} />
          {/* Underside folds tucking behind bottom & right card edges */}
          <path d="M34 114 C24 118, 14 114, 10 106 L32 104 Z" fill="#3B0A10" />
          <path d="M112 38 C118 28, 114 16, 106 12 L102 32 Z" fill="#3B0A10" />
          {/* Main sweeping Sablay band across bottom-right corner */}
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
            stroke="#F5A623"
            strokeWidth="1.5"
            strokeOpacity="0.9"
          />
        </svg>
      )}
    </>
  );
};

interface SablayButtonWrapProps {
  children: React.ReactNode;
  className?: string;
}

// Wraps main-page CTA buttons with diagonal curved Sablay ribbon curls over opposite corners
export const SablayButtonWrap: React.FC<SablayButtonWrapProps> = ({ children, className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const patId = `sablay-btn-${uid}`;
  const sheenId = `sablay-btn-sh-${uid}`;

  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {/* Top-Left Button Corner Curl */}
      <svg
        viewBox="0 0 64 48"
        className="w-8 h-6 sm:w-9 sm:h-7 absolute -top-1.5 -left-1.5 pointer-events-none z-20 drop-shadow-[0_3px_5px_rgba(13,31,92,0.35)]"
        fill="none"
        aria-hidden="true"
      >
        <SablayPatternDefs patternId={patId} gradId={sheenId} scale={0.35} />
        <path d="M5 34 C1 40, 4 45, 9 46 L11 36 Z" fill="#3B0A10" />
        <path
          d="M5 34 C7 17, 22 6, 46 3 L54 10 L44 13 C27 16, 17 25, 11 36 L5 34 Z"
          fill={`url(#${patId})`}
        />
        <path
          d="M5 34 C7 17, 22 6, 46 3 L54 10 L44 13 C27 16, 17 25, 11 36 L5 34 Z"
          fill={`url(#${sheenId})`}
        />
        <path d="M6 33 C8 17, 22 7, 46 4" stroke="#F5A623" strokeWidth="1.2" />
      </svg>

      {/* Bottom-Right Button Corner Curl */}
      <svg
        viewBox="0 0 64 48"
        className="w-8 h-6 sm:w-9 sm:h-7 absolute -bottom-1.5 -right-1.5 pointer-events-none z-20 drop-shadow-[0_3px_5px_rgba(13,31,92,0.35)]"
        fill="none"
        aria-hidden="true"
      >
        <SablayPatternDefs patternId={`${patId}-br`} gradId={`${sheenId}-br`} scale={0.35} />
        <path d="M59 14 C63 8, 60 3, 55 2 L53 12 Z" fill="#3B0A10" />
        <path
          d="M59 14 C57 31, 42 42, 18 45 L10 38 L20 35 C37 32, 47 23, 53 12 L59 14 Z"
          fill={`url(#${patId}-br)`}
        />
        <path
          d="M59 14 C57 31, 42 42, 18 45 L10 38 L20 35 C37 32, 47 23, 53 12 L59 14 Z"
          fill={`url(#${sheenId}-br)`}
        />
        <path d="M58 15 C56 31, 42 41, 18 44" stroke="#F5A623" strokeWidth="1.2" />
      </svg>
    </div>
  );
};

interface SunWatermarkProps {
  className?: string;
}

export const PhilippineSunWatermark: React.FC<SunWatermarkProps> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* 8 primary & secondary rays around central Philippine sun */}
    <g fill="#F5A623">
      {Array.from({ length: 8 }).map((_, idx) => (
        <g key={idx} transform={`rotate(${idx * 45} 100 100)`}>
          <polygon points="100,14 93,54 100,48 107,54" opacity="0.9" />
          <polygon points="100,26 96,52 104,52" opacity="0.45" transform="rotate(22.5 100 100)" />
        </g>
      ))}
      <circle cx="100" cy="100" r="32" opacity="0.95" />
      <circle cx="100" cy="100" r="24" fill="#F7B84D" opacity="0.65" />
    </g>
    {/* Three 5-pointed stars framing the sun */}
    <g fill="#F5A623" opacity="0.9">
      <polygon points="32,34 35,42 44,42 37,47 39,55 32,50 25,55 27,47 20,42 29,42" />
      <polygon points="168,34 171,42 180,42 173,47 175,55 168,50 161,55 163,47 156,42 165,42" />
      <polygon points="100,168 103,176 112,176 105,181 107,189 100,184 93,189 95,181 88,176 97,176" />
    </g>
  </svg>
);
