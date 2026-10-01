import React from 'react';
import { Link } from 'react-router-dom';
import { PlaceholderEventBanner } from '../components/placeholders/PlaceholderEventBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <PlaceholderEventBanner />
      
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 md:py-32 section-divider w-full">
        {/* Event Details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 animate-appear delay-100">
          <div className="card text-center group">
            <div className="w-12 h-12 rounded-full bg-midnight-navy/5 border border-midnight-navy/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-heading font-semibold text-2xl mb-2 text-midnight-navy/90 group-hover:text-gold transition-colors">Event</h3>
            <p className="text-midnight-navy/60">MOPCY Diocesan Youth Day 2026</p>
          </div>
          <div className="card text-center group">
            <div className="w-12 h-12 rounded-full bg-midnight-navy/5 border border-midnight-navy/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="font-heading font-semibold text-2xl mb-2 text-midnight-navy/90 group-hover:text-gold transition-colors">Venue</h3>
            <p className="text-midnight-navy/60">GHQ, Philippines</p>
          </div>
          <div className="card text-center group">
            <div className="w-12 h-12 rounded-full bg-midnight-navy/5 border border-midnight-navy/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-heading font-semibold text-2xl mb-2 text-midnight-navy/90 group-hover:text-gold transition-colors">Date</h3>
            <p className="text-midnight-navy/60">TBA</p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-24 animate-appear delay-200">
          <div className="text-center mb-16">
            <div className="inline-block animate-appear flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-midnight-navy/10 bg-midnight-navy/5 backdrop-blur-md mx-auto">
              <span className="text-sm font-medium text-midnight-navy/80">Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold gradient-text mb-4 text-balance mx-auto">How It Works</h2>
            <p className="text-midnight-navy/60 text-lg">Your journey to join the Diocesan Youth Day 2026.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-midnight-navy/10 z-0"></div>
            {[
              { num: 1, title: 'Register', desc: 'Fill out your details and select your camp' },
              { num: 2, title: 'Pay', desc: 'Pay via GCash or Bank Transfer and upload proof' },
              { num: 3, title: 'Get Ticket', desc: 'Receive your e-ticket after approval' }
            ].map((step) => (
              <div key={step.num} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-midnight-navy/[0.03] backdrop-blur border border-midnight-navy/[0.08] text-gold font-semibold text-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(245,166,35,0.15)] group-hover:shadow-[0_0_25px_rgba(245,166,35,0.3)] group-hover:border-gold/30 transition-all">
                  {step.num}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-midnight-navy/90">{step.title}</h3>
                <p className="text-midnight-navy/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center animate-appear delay-300 relative py-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-radial-gradient from-gold/20 to-transparent opacity-30 blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold mb-8 text-balance">Ready to secure your spot?</h2>
            <Link to="/register" className="inline-block btn-primary text-lg px-8 py-4">
              Register Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
