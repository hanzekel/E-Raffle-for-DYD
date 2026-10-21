import React from 'react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 120, className = '' }) => {
  return (
    <img 
      src="/logo.png" 
      alt="DYD 2026 Logo" 
      className={`object-contain ${className}`}
      style={{ width: size, height: size }} 
    />
  );
};
