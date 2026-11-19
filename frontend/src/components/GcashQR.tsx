import React from 'react';

// Displays the extracted official GCash QR code in a high-contrast white scan frame
export const GcashQR: React.FC = () => {
  return (
    <div className="inline-flex flex-col items-center p-4 bg-white rounded-2xl border-2 border-[#007DFE]/30 shadow-lg mx-auto">
      <div className="w-[210px] h-[210px] sm:w-[230px] sm:h-[230px] flex items-center justify-center bg-white rounded-xl overflow-hidden">
        <img
          src="/gcash-qr.png"
          alt="GCash Payment QR Code"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="mt-2.5 text-[11px] font-bold tracking-wider uppercase text-[#007DFE]">
        Scan via GCash App
      </span>
    </div>
  );
};
