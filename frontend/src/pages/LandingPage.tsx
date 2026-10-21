import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';
import {
  TicketIcon,
  LockIcon,
  GiftIcon,
  TargetIcon,
  HandshakeIcon,
  BookOpenIcon,
  CelebrationIcon,
  SparklesIcon,
} from '../components/icons/Icons';

export const LandingPage: React.FC = () => {
  const { config } = useConfig();
  
  // Interactive ticket preview state
  const [demoName, setDemoName] = useState<string>('');
  const [demoCamp, setDemoCamp] = useState<string>('');

  // Target draw date from config or fallback
  const targetDateStr = config?.drawDate || '2026-11-28T18:00:00+08:00';

  // Dynamic countdown timer
  const [isDrawLive, setIsDrawLive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDateStr) - +new Date();
      if (difference <= 0) {
        setIsDrawLive(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsDrawLive(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  // Build registration link with pre-filled preview values
  const getRegisterLink = () => {
    const params = new URLSearchParams();
    if (demoName.trim()) params.set('name', demoName.trim());
    if (demoCamp.trim()) params.set('camp', demoCamp.trim());
    const query = params.toString();
    return query ? `/register?${query}` : '/register';
  };

  return (
    <div className="flex flex-col w-full pb-8 sm:pb-12 pt-1 sm:pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Live Status Header Ticker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-5 pb-2.5 sm:pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-slate-700">
            E-Raffle Portal Active &bull; Diocesan Youth Day 2026
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-semibold text-royal-blue bg-royal-blue/10 px-2.5 sm:px-3 py-1 rounded-full">
            {typeof config?.eligibleEntries === 'number' ? `${config.eligibleEntries} Eligible Entries Live` : '40 Years in Mission'}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-gold bg-midnight-navy px-2.5 sm:px-3 py-1 rounded-full">
            ₱{config?.ticketPrice || 100} / Entry
          </span>
        </div>
      </div>

      {/* Bento Grid Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 auto-rows-min mb-6 sm:mb-8">
        {/* Bento Box 1: Full-Width Hero Card (No Blank Space) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-midnight-navy via-royal-blue to-royal-blue-dark text-white p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Column: Heading, Subtitle & CTAs */}
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-gold text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-2.5 sm:mb-3">
                <SparklesIcon size={14} className="text-gold" />
                <span>Take Courage, Youth in Christ &bull; 40 Years in Mission</span>
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight mb-2 sm:mb-2.5">
                Your Ticket. <span className="text-gold">Their Mission.</span> One Grand Day.
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl mb-4 sm:mb-5">
                Secure your official Diocesan Youth Day 2026 raffle entries online. Instant verified digital ticket, GCash & Bank integration, and live public draw.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Link
                  to={getRegisterLink()}
                  className="bg-gold hover:bg-gold-light text-midnight-navy font-black px-6 py-2.5 sm:px-7 sm:py-3 rounded-full text-xs sm:text-sm transition-all shadow-md text-center active:scale-95"
                >
                  Get E-Tickets &bull; ₱{config?.ticketPrice || 100}
                </Link>
                <Link
                  to="/verify"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm transition-all text-center border border-white/15"
                >
                  Check My Tickets
                </Link>
              </div>
            </div>

            {/* Right Column: High-Value Benefit Badges (Eliminates Blank Space) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 lg:w-72 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/15 lg:pl-6">
              <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center font-bold text-sm shrink-0">₱</span>
                <div className="text-left text-xs">
                  <span className="font-bold text-white block">100% Youth Mission</span>
                  <span className="text-[10px] text-slate-300">Direct diocesan subsidies</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                <span className="w-8 h-8 rounded-lg bg-sky-400/20 text-sky-300 flex items-center justify-center font-bold text-sm shrink-0">⚡</span>
                <div className="text-left text-xs">
                  <span className="font-bold text-white block">Instant E-Ticket</span>
                  <span className="text-[10px] text-slate-300">Automated vault code</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                <span className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0"><LockIcon size={14} /></span>
                <div className="text-left text-xs">
                  <span className="font-bold text-white block">CSPRNG Verified</span>
                  <span className="text-[10px] text-slate-300">Provably fair live draw</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Interactive Golden Pass Preview Card */}
        <div className="md:col-span-3 lg:col-span-2 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-50 to-white border-2 border-gold/40 p-4 sm:p-6 shadow-sm flex flex-col justify-between group hover:border-gold transition-all">
          <div className="flex justify-between items-start mb-2.5 sm:mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-midnight-navy px-2.5 py-0.5 rounded-full">
                Sample Ticket Preview
              </span>
              <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 mt-1 sm:mt-1.5">
                Official Ticket Preview
              </h2>
            </div>
            <span className="text-royal-blue bg-royal-blue/10 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <TicketIcon size={20} />
            </span>
          </div>

          {/* Rendered Digital Ticket Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-dashed border-slate-300 shadow-inner relative font-mono text-xs mb-2.5 sm:mb-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-bold text-royal-blue">MOPCY-DYD26-PASS</span>
              <span className="text-gold font-extrabold">₱{config?.ticketPrice || 100}.00</span>
            </div>
            <div className="py-2.5 text-[11px] text-slate-700 space-y-1">
              <p>
                NAME: <span className="font-bold text-slate-900">{demoName.trim() || 'YOUR NAME HERE'}</span>
              </p>
              <p>
                CAMP: <span className="font-semibold text-royal-blue">{demoCamp.trim() || 'PARISH YOUTH DELEGATION'}</span>
              </p>
              <p>
                DRAW: <span className="text-emerald-600 font-semibold">VERIFIED ENTRY &bull; 40Y MISSION</span>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
              <span className="tracking-widest">||| |||| | ||| ||||</span>
              <span className="inline-flex items-center gap-1.5 font-medium"><LockIcon size={12} className="text-slate-500" /> VERIFIED UNIQUE NUMBER</span>
            </div>
          </div>

          {/* Interactive Live Input Bar */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5 mb-3">
            <label className="text-[10px] text-slate-500 font-bold block">
              Try customizing your preview pass:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                placeholder="Type your full name..."
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-royal-blue bg-white"
              />
              <input
                type="text"
                value={demoCamp}
                onChange={(e) => setDemoCamp(e.target.value)}
                placeholder="Parish or Camp name..."
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-royal-blue bg-white"
              />
            </div>
          </div>

          <Link
            to={getRegisterLink()}
            className="text-xs font-bold text-royal-blue hover:text-midnight-navy flex items-center justify-between bg-royal-blue/5 hover:bg-royal-blue/10 px-4 py-2.5 rounded-xl transition-colors"
          >
            <span>Proceed with this pass name</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Bento Box 3: Dynamic Live Countdown to Draw */}
        <div className="md:col-span-1 lg:col-span-1 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-royal-blue">
              Grand Draw Status
            </span>
            <span className="text-xs font-mono font-semibold text-slate-400">2026</span>
          </div>

          {isDrawLive ? (
            <div className="bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-2xl p-4 text-center my-2 shadow-md animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <CelebrationIcon size={20} className="text-white" />
                <p className="font-heading font-black text-lg">DRAW LIVE NOW!</p>
              </div>
              <p className="text-[11px] opacity-90 mt-1">Winning tickets being drawn on stage</p>
              <Link
                to="/live"
                className="inline-block mt-3 bg-white text-slate-900 font-bold text-xs px-4 py-1.5 rounded-full shadow"
              >
                Watch Draw &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 text-center my-2">
              {[
                { val: timeLeft.days, label: 'DAYS' },
                { val: timeLeft.hours, label: 'HRS' },
                { val: timeLeft.minutes, label: 'MIN' },
                { val: timeLeft.seconds, label: 'SEC' },
              ].map((slot) => (
                <div key={slot.label} className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <span className="font-heading font-black text-xl text-royal-blue block">
                    {String(slot.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">{slot.label}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-500 mt-2">
            Draw takes place live with Diocesan Youth Council auditors.
          </p>
        </div>

        {/* Bento Box 4: Mystery Grand Prizes Teaser (Prizes TBA) */}
        <div className="md:col-span-2 lg:col-span-1 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 to-midnight-navy text-white p-4 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold bg-white/10 px-2.5 py-0.5 rounded-full">
                Grand Rewards
              </span>
              <span className="text-gold bg-white/10 p-2 rounded-xl flex items-center justify-center">
                <GiftIcon size={20} />
              </span>
            </div>

            <h3 className="font-heading font-bold text-lg text-white mb-2 flex items-center gap-2">
              <span>Prizes Under Wraps</span>
              <LockIcon size={16} className="text-gold" />
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Major prizes being finalized by the organizing committee! Official announcements dropping across diocesan social channels soon.
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gold font-semibold">
            <span>Multiple Cash & Major Draws</span>
            <span>Stay Tuned &bull; 2026</span>
          </div>
        </div>

        {/* Bento Box 5: Where ₱100 Goes (Mission Impact) */}
        <div className="md:col-span-2 lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Where Your ₱100 Goes
            </h3>
            <span className="text-xs font-bold text-royal-blue bg-royal-blue/10 px-3 py-1 rounded-full">
              Mission Transparency
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-royal-blue/10 text-royal-blue flex items-center justify-center mb-2">
                <HandshakeIcon size={18} />
              </div>
              <h4 className="font-bold text-xs text-slate-800">Youth Subsidies</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Supports camp registration for delegates in need.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-royal-blue/10 text-royal-blue flex items-center justify-center mb-2">
                <BookOpenIcon size={18} />
              </div>
              <h4 className="font-bold text-xs text-slate-800">Formation Kits</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Funds parish youth ministry guides and materials.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-royal-blue/10 text-royal-blue flex items-center justify-center mb-2">
                <CelebrationIcon size={18} />
              </div>
              <h4 className="font-bold text-xs text-slate-800">Celebration</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Powers the 40-year milestone Diocesan Youth Day rally.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-3">
            Organized by the Diocesan Youth Ministry with full financial reporting post-draw.
          </p>
        </div>

        {/* Bento Box 6: Fair Draw Engine & Transparency */}
        <div className="md:col-span-1 lg:col-span-2 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-royal-blue/5 via-sky-blue/10 to-gold/10 border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-royal-blue text-white flex items-center justify-center shrink-0 shadow-md">
              <TargetIcon size={24} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">
                Transparent E-Raffle System
              </h4>
              <p className="text-xs text-slate-500">
                Official automated draw. Every ticket has a verified unique number for a 100% fair and transparent raffle.
              </p>
            </div>
          </div>

          <Link
            to="/live"
            className="w-full sm:w-auto text-xs font-bold text-royal-blue hover:text-midnight-navy px-5 py-2.5 rounded-full border border-royal-blue/30 bg-white whitespace-nowrap text-center shadow-sm"
          >
            Preview Draw Screen &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
