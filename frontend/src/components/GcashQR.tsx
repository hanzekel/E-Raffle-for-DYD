import React from 'react';

// TODO: Replace with actual asset
export const GcashQR: React.FC = () => {
  return (
    <div className="w-[200px] h-[200px] border-2 border-dashed border-gold/40 flex items-center justify-center bg-midnight-navy/5 mx-auto rounded-2xl shadow-lg relative overflow-hidden group hover:border-gold/60 transition-colors">
      <div className="absolute inset-0 bg-radial-gradient from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="text-midnight-navy/60 text-center px-4 text-sm font-medium relative z-10">
        GCash QR Code<br/><span className="text-xs text-midnight-navy/40 mt-1 block">Upload in Admin Panel</span>
      </span>
    </div>
  );
};
