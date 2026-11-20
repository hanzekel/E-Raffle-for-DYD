// Philippine cultural vector SVG motifs: 8-ray sun with 3 stars & woven banig/inabel ribbon
import React from 'react';

interface WovenRibbonProps {
  className?: string;
}

export const WovenRibbon: React.FC<WovenRibbonProps> = ({ className = 'h-1.5 w-full' }) => (
  <div className={`woven-ethnic-bar ${className}`} aria-hidden="true" />
);

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
