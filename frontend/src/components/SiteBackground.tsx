// Site-wide HD photographic background with Marian blue gradient and balanced opacity
import React from 'react';

export const SiteBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* High-definition photo centered on altar and youth */}
      <img
        src="/dyd-background.jpg"
        alt=""
        className="w-full h-full object-cover object-[center_35%] scale-100 opacity-[0.22] filter contrast-[1.05]"
      />

      {/* Royal blue and midnight navy gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/30 via-midnight-navy/20 to-royal-blue/35 mix-blend-multiply pointer-events-none" />

      {/* Ambient soft glow at top for navbar contrast */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#F8FAFC]/80 to-transparent pointer-events-none" />
    </div>
  );
};

