import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PlaceholderLogo } from './placeholders/PlaceholderLogo';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-midnight-navy">
      <header className="fixed top-0 left-0 right-0 h-16 bg-midnight-navy/10 backdrop-blur-xl z-50 border-b border-midnight-navy/5 flex items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <PlaceholderLogo size={40} />
          <span className="font-heading font-semibold text-xl text-midnight-navy tracking-wide group-hover:text-gold transition-colors">DYD 2026</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 glass px-6 py-2 rounded-full border-midnight-navy/10 shadow-lg">
          <Link to="/" className={`font-medium transition-colors ${isActive('/') ? 'text-gold' : 'text-midnight-navy/70 hover:text-midnight-navy'}`}>Home</Link>
          <Link to="/register" className={`font-medium transition-colors ${isActive('/register') ? 'text-gold' : 'text-midnight-navy/70 hover:text-midnight-navy'}`}>Register</Link>
          <Link to="/verify" className={`font-medium transition-colors ${isActive('/verify') ? 'text-gold' : 'text-midnight-navy/70 hover:text-midnight-navy'}`}>Tickets</Link>
          <Link to="/raffle" className={`font-medium transition-colors ${isActive('/raffle') ? 'text-gold' : 'text-midnight-navy/70 hover:text-midnight-navy'}`}>Live Draw</Link>
        </nav>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-midnight-navy/70 hover:text-midnight-navy p-2 focus:outline-none transition-colors"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-midnight-navy/10 backdrop-blur-xl border-b border-midnight-navy/10 flex flex-col p-4 md:hidden shadow-xl animate-appear z-50">
            <Link to="/" className={`py-4 border-b border-midnight-navy/5 font-medium ${isActive('/') ? 'text-gold' : 'text-midnight-navy/80'}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/register" className={`py-4 border-b border-midnight-navy/5 font-medium ${isActive('/register') ? 'text-gold' : 'text-midnight-navy/80'}`} onClick={() => setMobileMenuOpen(false)}>Register</Link>
            <Link to="/verify" className={`py-4 border-b border-midnight-navy/5 font-medium ${isActive('/verify') ? 'text-gold' : 'text-midnight-navy/80'}`} onClick={() => setMobileMenuOpen(false)}>Tickets</Link>
            <Link to="/raffle" className={`py-4 font-medium ${isActive('/raffle') ? 'text-gold' : 'text-midnight-navy/80'}`} onClick={() => setMobileMenuOpen(false)}>Live Draw</Link>
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col relative pt-16">
        <Outlet />
      </main>

      <footer className="bg-[#F8FAFC] py-12 border-t border-midnight-navy/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-filipiniana-pattern opacity-5 mix-blend-screen pointer-events-none"></div>
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <PlaceholderLogo size={32} className="mx-auto mb-4 opacity-50" />
          <p className="font-heading font-semibold text-midnight-navy/90 text-lg mb-2">MOPCY DYD 2026</p>
          <p className="text-midnight-navy/50 text-sm">Take Courage, Youth in Christ: 40 Years in Mission</p>
        </div>
      </footer>
    </div>
  );
};
