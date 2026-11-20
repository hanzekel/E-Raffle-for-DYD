// Vector SVG artwork per raffle prize with automatic image override when asset files are added
import React, { useState } from 'react';
import { PrizeItem } from '../data/prizes';

interface PrizeArtworkProps {
  id: PrizeItem['id'];
}

const PrizeSvg: React.FC<PrizeArtworkProps> = ({ id }) => {
  switch (id) {
    case 'powerbank':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-sm" fill="none" aria-hidden="true">
          <rect x="28" y="18" width="64" height="84" rx="14" fill="#0B1A3D" stroke="#F5A623" strokeWidth="3" />
          <rect x="35" y="25" width="50" height="70" rx="10" fill="#1A3A8F" />
          {/* Digital display bar */}
          <rect x="42" y="34" width="36" height="16" rx="4" fill="#08132E" />
          <path d="M58 37L54 42H59L57 47L63 41H58L58 37Z" fill="#F5A623" />
          {/* Charge indicator dots */}
          <circle cx="48" cy="60" r="2.5" fill="#F5A623" />
          <circle cx="56" cy="60" r="2.5" fill="#F5A623" />
          <circle cx="64" cy="60" r="2.5" fill="#F5A623" />
          <circle cx="72" cy="60" r="2.5" fill="#38BDF8" />
          {/* Top USB-C / USB-A ports */}
          <rect x="45" y="12" width="12" height="6" rx="2" fill="#94A3B8" />
          <rect x="63" y="12" width="12" height="6" rx="2" fill="#94A3B8" />
          <text x="60" y="83" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">FAST 20W</text>
        </svg>
      );

    case 'turbo-fan':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-sm" fill="none" aria-hidden="true">
          {/* Fan handle */}
          <rect x="51" y="66" width="18" height="40" rx="8" fill="#1A3A8F" stroke="#0B1A3D" strokeWidth="2.5" />
          <circle cx="60" cy="80" r="3.5" fill="#F5A623" />
          {/* Fan outer ring */}
          <circle cx="60" cy="44" r="30" fill="#FFFFFF" stroke="#1A3A8F" strokeWidth="4" />
          <circle cx="60" cy="44" r="24" fill="#E0F2FE" stroke="#F5A623" strokeWidth="2" />
          {/* Turbine blades */}
          <path d="M60 44 C54 30, 66 22, 68 32 C70 39, 64 43, 60 44 Z" fill="#1A3A8F" />
          <path d="M60 44 C73 39, 80 51, 70 53 C63 54, 61 48, 60 44 Z" fill="#1A3A8F" />
          <path d="M60 44 C64 58, 52 65, 50 55 C49 48, 55 45, 60 44 Z" fill="#1A3A8F" />
          <path d="M60 44 C46 48, 40 36, 50 34 C57 33, 59 39, 60 44 Z" fill="#1A3A8F" />
          {/* Center hub */}
          <circle cx="60" cy="44" r="6" fill="#0B1A3D" stroke="#F5A623" strokeWidth="2" />
          {/* Wind breeze lines */}
          <path d="M94 34C98 34 102 31 102 28" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M95 44H106" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'tumbler':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-sm" fill="none" aria-hidden="true">
          {/* Cap & carry loop */}
          <path d="M50 18C50 12 70 12 70 18" stroke="#0B1A3D" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="44" y="18" width="32" height="12" rx="4" fill="#0B1A3D" />
          <rect x="46" y="29" width="28" height="4" fill="#94A3B8" />
          {/* Insulated flask body */}
          <rect x="38" y="33" width="44" height="72" rx="10" fill="#1A3A8F" stroke="#0B1A3D" strokeWidth="2.5" />
          {/* Gold band & water wave motif */}
          <rect x="38" y="70" width="44" height="12" fill="#F5A623" />
          <path d="M52 52C52 46 60 40 60 40C60 40 68 46 68 52C68 56.5 64.4 60 60 60C55.6 60 52 56.5 52 52Z" fill="#E0F2FE" />
          <rect x="46" y="38" width="4" height="58" rx="2" fill="white" fillOpacity="0.22" />
        </svg>
      );

    case 'starbucks-gc':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm" fill="none" aria-hidden="true">
          <rect x="14" y="30" width="92" height="60" rx="10" fill="#00704A" stroke="#0B1A3D" strokeWidth="2.5" />
          <rect x="14" y="42" width="92" height="10" fill="#1E3932" />
          {/* Coffee cup emblem */}
          <circle cx="42" cy="70" r="14" fill="#FFFFFF" />
          <path d="M36 65H48L46.5 78H37.5L36 65Z" fill="#00704A" />
          <rect x="35" y="63" width="14" height="3" rx="1.5" fill="#1E3932" />
          {/* Gift value badge */}
          <rect x="63" y="61" width="34" height="18" rx="6" fill="#F5A623" />
          <text x="80" y="73" textAnchor="middle" fill="#0B1A3D" fontSize="10" fontWeight="bold" fontFamily="sans-serif">P300</text>
        </svg>
      );

    case 'earbuds':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm" fill="none" aria-hidden="true">
          {/* Charging case */}
          <rect x="26" y="36" width="68" height="54" rx="20" fill="#FFFFFF" stroke="#1A3A8F" strokeWidth="3" />
          <path d="M26 56H94" stroke="#CBD5E1" strokeWidth="2" />
          {/* Left & Right buds */}
          <circle cx="46" cy="48" r="9" fill="#0B1A3D" />
          <rect x="43" y="54" width="6" height="14" rx="3" fill="#0B1A3D" />
          <circle cx="74" cy="48" r="9" fill="#0B1A3D" />
          <rect x="71" y="54" width="6" height="14" rx="3" fill="#0B1A3D" />
          {/* LED indicator */}
          <circle cx="60" cy="76" r="3.5" fill="#10B981" />
          {/* Sound wave */}
          <path d="M20 44C16 49 16 57 20 62" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M100 44C104 49 104 57 100 62" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'merch':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm" fill="none" aria-hidden="true">
          {/* Tee shirt silhouette */}
          <path
            d="M38 24L20 36L28 52L38 46V94H82V46L92 52L100 36L82 24L70 30C64 33 56 33 50 30L38 24Z"
            fill="#1A3A8F"
            stroke="#0B1A3D"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="60" cy="56" r="13" fill="#F5A623" />
          <text x="60" y="60" textAnchor="middle" fill="#0B1A3D" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">DYD26</text>
          <text x="60" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">40 YEARS</text>
        </svg>
      );
  }
};

export const PrizeVisual: React.FC<{ prize: PrizeItem }> = ({ prize }) => {
  const [imgError, setImgError] = useState(false);

  if (prize.imageSrc && !imgError) {
    return (
      <img
        src={prize.imageSrc}
        alt={`${prize.name} (${prize.brandOrType})`}
        onError={() => setImgError(true)}
        className="w-full h-full object-contain p-1.5"
      />
    );
  }

  return <PrizeSvg id={prize.id} />;
};
