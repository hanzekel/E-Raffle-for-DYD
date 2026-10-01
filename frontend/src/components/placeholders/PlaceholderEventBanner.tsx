import React from 'react';
import { PlaceholderLogo } from './PlaceholderLogo';
import { Link } from 'react-router-dom';

export const PlaceholderEventBanner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden section-divider py-24 md:py-32 flex flex-col items-center justify-center text-center">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-gradient from-gold/30 to-transparent opacity-20 blur-3xl pointer-events-none animate-glow"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-filipiniana-pattern opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center px-4 max-w-5xl mx-auto">
        {/* Badge Pill */}
        <div className="animate-appear delay-100 flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-midnight-navy/10 bg-midnight-navy/5 backdrop-blur-md">
          <span className="text-sm font-medium text-midnight-navy/80">🎟️ DYD 2026 Raffle</span>
          <span className="text-midnight-navy/30">•</span>
          <Link to="/register" className="text-sm font-medium text-gold hover:text-gold-light transition-colors inline-flex items-center gap-1">
            Register Now <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <PlaceholderLogo size={64} className="mb-6 animate-appear delay-200" />
        
        {/* Huge Gradient Headline */}
        <h1 className="animate-appear delay-300 text-4xl sm:text-5xl lg:text-7xl font-heading font-semibold leading-tight text-balance mb-6 gradient-text">
          Take Courage, Youth in Christ
        </h1>
        
        {/* Subtitle */}
        <p className="animate-appear delay-400 text-lg sm:text-xl text-midnight-navy/60 max-w-[740px] text-balance mb-10">
          40 Years in Mission — Diocesan Youth Day 2026
        </p>

        {/* CTA Buttons */}
        <div className="animate-appear delay-500 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/register" className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-lg">
            Register Now
          </Link>
          <a href="#details" className="w-full sm:w-auto btn-secondary text-lg">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};
