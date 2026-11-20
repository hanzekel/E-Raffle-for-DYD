// frontend/src/components/Layout.tsx
// Main application layout with role-aware header navigation
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../hooks/useAuth';
import { ShieldIcon } from './icons/Icons';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]/30 text-midnight-navy relative z-10">
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/85 backdrop-blur-xl z-50 border-b border-midnight-navy/10 flex items-center justify-between px-3 md:px-8 shadow-sm">
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group relative z-10">
          <Logo size={36} />
          <div className="leading-tight">
            <span className="font-heading font-bold text-lg sm:text-xl text-midnight-navy tracking-wide group-hover:text-royal-blue transition-colors block">
              DYD 2026
            </span>
            <span className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.2em] text-highlight-red">
              40 Years in Mission
            </span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 glass px-5 py-1.5 rounded-full border border-midnight-navy/10 shadow-md text-sm relative z-10">
          <Link to="/" className={`font-semibold transition-colors px-2 py-0.5 rounded-full ${isActive('/') ? 'text-royal-blue bg-gold/20' : 'text-midnight-navy/75 hover:text-royal-blue'}`}>Home</Link>
          <Link to="/register" className={`font-semibold transition-colors px-2 py-0.5 rounded-full ${isActive('/register') ? 'text-royal-blue bg-gold/20' : 'text-midnight-navy/75 hover:text-royal-blue'}`}>Register</Link>
          <Link to="/verify" className={`font-semibold transition-colors px-2 py-0.5 rounded-full ${isActive('/verify') ? 'text-royal-blue bg-gold/20' : 'text-midnight-navy/75 hover:text-royal-blue'}`}>Tickets</Link>
          <Link to="/raffle" className={`font-semibold transition-colors px-2 py-0.5 rounded-full ${isActive('/raffle') || isActive('/live') ? 'text-highlight-red bg-highlight-red/10' : 'text-midnight-navy/75 hover:text-highlight-red'}`}>Live Draw</Link>
          
          {/* Admin Indicator in Desktop Nav */}
          {isAdmin && (
            <div className="flex items-center gap-2 pl-3 border-l border-midnight-navy/10">
              <Link 
                to="/admin/dashboard" 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-midnight-navy text-gold text-xs font-bold hover:bg-midnight-navy/90 transition-colors shadow-sm"
              >
                <ShieldIcon size={12} />
                <span>Admin Dashboard</span>
              </Link>
              <button 
                onClick={logout}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger & Admin Pill */}
        <div className="flex items-center gap-2 md:hidden relative z-10">
          {isAdmin && (
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-midnight-navy text-gold text-[11px] font-bold shadow-sm"
            >
              <ShieldIcon size={10} />
              <span>Admin</span>
            </Link>
          )}
          <button 
            className="text-midnight-navy/80 hover:text-midnight-navy p-2 focus:outline-none transition-colors"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-[#F8FAFC]/95 backdrop-blur-xl border-b border-midnight-navy/10 flex flex-col p-4 md:hidden shadow-xl animate-appear z-50">
            <Link to="/" className={`py-3 border-b border-midnight-navy/5 font-medium ${isActive('/') ? 'text-gold' : 'text-midnight-navy/80'}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/register" className={`py-3 border-b border-midnight-navy/5 font-medium ${isActive('/register') ? 'text-gold' : 'text-midnight-navy/80'}`} onClick={() => setMobileMenuOpen(false)}>Register</Link>
            <Link to="/verify" className={`py-3 border-b border-midnight-navy/5 font-medium ${isActive('/verify') ? 'text-gold' : 'text-midnight-navy/80'}`} onClick={() => setMobileMenuOpen(false)}>Tickets</Link>
            <Link to="/raffle" className={`py-3 font-medium ${isActive('/raffle') || isActive('/live') ? 'text-gold' : 'text-midnight-navy/80'}`} onClick={() => setMobileMenuOpen(false)}>Live Draw</Link>
            
            {isAdmin && (
              <div className="mt-3 pt-3 border-t border-midnight-navy/10 flex items-center justify-between">
                <Link 
                  to="/admin/dashboard" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-midnight-navy text-gold text-xs font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldIcon size={12} />
                  <span>Admin Dashboard</span>
                </Link>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-xs text-rose-600 font-bold px-3 py-1.5 rounded bg-rose-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col relative pt-14">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-r from-[#B92529]/95 via-[#991B1B]/95 to-[#B92529]/95 text-white backdrop-blur-md py-8 border-t border-gold/30 relative overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <Logo size={34} className="mx-auto mb-3 bg-white/95 rounded-full p-1 shadow" />
          <p className="font-heading font-bold text-white text-lg mb-1">MOPCY DYD 2026</p>
          <p className="text-amber-100/95 text-sm font-medium">
            Take Courage, Youth in Christ: 40 Years in Mission
          </p>
          <p className="text-white/90 text-xs italic mt-2">
            &ldquo;But take courage! I have overcome the world.&rdquo; &mdash; John 16:33
          </p>
          <p className="mt-3 text-[11px] font-extrabold tracking-widest uppercase text-gold-light">
            Hukbong Kalakbay, MOPCY! Sir Yes Sir! AHU AHU!
          </p>
        </div>
      </footer>
    </div>
  );
};
