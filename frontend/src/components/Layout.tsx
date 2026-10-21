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
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/70 backdrop-blur-xl z-50 border-b border-midnight-navy/10 flex items-center justify-between px-3 md:px-8 shadow-sm">
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <Logo size={36} />
          <span className="font-heading font-semibold text-lg sm:text-xl text-midnight-navy tracking-wide group-hover:text-gold transition-colors">DYD 2026</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 glass px-6 py-2 rounded-full border-midnight-navy/10 shadow-lg text-sm">
          <Link to="/" className={`font-medium transition-colors ${isActive('/') ? 'text-gold' : 'text-midnight-navy/70 hover:text-midnight-navy'}`}>Home</Link>
          <Link to="/register" className={`font-medium transition-colors ${isActive('/register') ? 'text-gold' : 'text-midnight-navy/70 hover:text-midnight-navy'}`}>Register</Link>
          <Link to="/verify" className={`font-medium transition-colors ${isActive('/verify') ? 'text-gold' : 'text-midnight-navy/70 hover:text-midnight-navy'}`}>Tickets</Link>
          <Link to="/raffle" className={`font-medium transition-colors ${isActive('/raffle') || isActive('/live') ? 'text-gold' : 'text-midnight-navy/70 hover:text-midnight-navy'}`}>Live Draw</Link>
          
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
        <div className="flex items-center gap-2 md:hidden">
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
            className="text-midnight-navy/70 hover:text-midnight-navy p-2 focus:outline-none transition-colors"
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

      <footer className="bg-[#F8FAFC]/80 backdrop-blur-md py-8 border-t border-midnight-navy/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-filipiniana-pattern opacity-5 mix-blend-screen pointer-events-none"></div>
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <Logo size={32} className="mx-auto mb-4 opacity-50" />
          <p className="font-heading font-semibold text-midnight-navy/90 text-lg mb-2">MOPCY DYD 2026</p>
          <p className="text-midnight-navy/50 text-sm">Take Courage, Youth in Christ: 40 Years in Mission</p>
        </div>
      </footer>
    </div>
  );
};
