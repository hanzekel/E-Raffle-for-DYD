import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative">
        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full"></div>
        <div className="w-12 h-12 border-4 border-midnight-navy/10 border-t-gold rounded-full animate-spin relative z-10 shadow-[0_0_15px_rgba(245,166,35,0.3)]"></div>
      </div>
      {message && <p className="mt-6 text-midnight-navy/70 font-medium tracking-wide animate-pulse">{message}</p>}
    </div>
  );
};
