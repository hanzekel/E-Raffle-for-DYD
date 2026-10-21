import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-lg text-center flex flex-col items-center justify-center animate-appear">
      <div className="card w-full p-8 sm:p-10 border border-slate-200 shadow-lg bg-white">
        <span className="text-5xl mb-4 block">🧭</span>
        <span className="text-xs font-bold uppercase tracking-widest text-gold bg-midnight-navy px-3 py-1 rounded-full inline-block mb-3">
          Error 404
        </span>
        <h1 className="text-3xl font-heading font-black text-slate-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          The link you followed might have expired, moved, or was typed with a small typo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary py-3 px-6 text-sm font-bold text-center">
            Go to Homepage &rarr;
          </Link>
          <Link to="/verify" className="btn-secondary py-3 px-6 text-sm font-semibold text-center">
            Find My Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

