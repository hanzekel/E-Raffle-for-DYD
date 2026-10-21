import React from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';

export const ConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  if (!id) return <Navigate to="/" />;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-14 max-w-lg flex flex-col items-center justify-center animate-appear">
      
      {/* Background celebration glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-radial-gradient from-green-500/20 to-transparent opacity-50 blur-3xl pointer-events-none"></div>
      
      <div className="card text-center w-full relative z-10 overflow-hidden border-t-2 border-t-green-500/50">
        
        <div className="w-24 h-24 bg-midnight-navy/5 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 text-green-400 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-heading font-semibold mb-4 gradient-text">Payment Submitted!</h1>
        <p className="text-midnight-navy/60 mb-10 text-lg leading-relaxed max-w-md mx-auto">
          Your payment is currently under review. Your e-tickets will be sent to your email upon approval.
        </p>

        <div className="bg-midnight-navy/[0.03] p-6 rounded-2xl mb-10 border border-midnight-navy/[0.08]">
          <p className="text-sm text-midnight-navy/50 mb-2 uppercase tracking-wider font-medium">Registration ID</p>
          <p className="font-mono font-semibold text-gold text-2xl tracking-wider select-all">{id}</p>
        </div>

        <div>
          <Link to="/" className="inline-block btn-secondary w-full py-4 text-lg">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
