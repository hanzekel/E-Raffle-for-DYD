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
import { PrizeShowcase } from '../components/PrizeShowcase';
import { WovenRibbon, PhilippineSunWatermark } from '../components/FilipinoMotifs';

export const LandingPage: React.FC = () => {
  const { config } = useConfig();
  
  // Interactive ticket preview state
  const [demoName, setDemoName] = useState<string>('');
  const [demoCamp, setDemoCamp] = useState<string>('');

  // Target draw date from config or fallback
  const targetDateStr = config?.drawDate || '2026-12-11T13:30:00+08:00';

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
            Raffle Now Open &bull; Diocesan Youth Day 2026
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-semibold text-royal-blue bg-royal-blue/10 px-2.5 sm:px-3 py-1 rounded-full">
            {typeof config?.eligibleEntries === 'number' ? `${config.eligibleEntries} Tickets In The Draw` : '40 Years in Mission'}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-gold bg-midnight-navy px-2.5 sm:px-3 py-1 rounded-full">
            ₱{config?.ticketPrice || 20} / Entry
          </span>
        </div>
      </div>

      {/* Bento Grid Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 auto-rows-min mb-6 sm:mb-8">
        {/* Bento Box 1: Full-Width Hero Card with Philippine Tricolor & Sun Heritage */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-midnight-navy via-royal-blue to-[#6E172E] text-white shadow-xl relative overflow-hidden border border-gold/30">
          <WovenRibbon className="h-[6px] w-full" />
          <div className="p-5 sm:p-7 md:p-8 relative">
            <PhilippineSunWatermark className="w-64 h-64 sm:w-80 sm:h-80 absolute -right-10 -bottom-16 opacity-[0.14] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Column: Heading, Subtitle & CTAs */}
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-gold/30 text-gold text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-2.5 sm:mb-3">
                  <SparklesIcon size={14} className="text-gold" />
                  <span>Bayanihan Spirit &bull; Take Courage, Youth in Christ &bull; 40 Years in Mission</span>
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight py-1 mb-1.5 sm:mb-2">
                  One Ticket. <span className="text-gold">Bayanihan Heart.</span> One Grand Day.
                </h1>
                <p className="text-slate-100/90 text-xs sm:text-sm leading-relaxed max-w-xl mb-4 sm:mb-5">
                  Stand together with Filipino Catholic youth across every camp for only <strong className="text-gold">₱{config?.ticketPrice || 20}</strong> per ticket—helping send delegates to DYD 2026 while giving you more chances to win!
                </p>

                {/* Action Buttons with Woven Philippine Border */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <Link
                    to={getRegisterLink()}
                    className="btn-woven-gold text-center"
                  >
                    Get E-Tickets &bull; ₱{config?.ticketPrice || 20}
                  </Link>
                  <Link
                    to="/verify"
                    className="btn-woven-glass text-center"
                  >
                    Check My Tickets
                  </Link>
                </div>
              </div>

              {/* Right Column: High-Value Benefit Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 lg:w-72 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/15 lg:pl-6">
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-gold/25">
                  <span className="w-8 h-8 rounded-lg bg-gold/25 text-gold flex items-center justify-center font-bold text-sm shrink-0">₱</span>
                  <div className="text-left text-xs">
                    <span className="font-bold text-white block">Pusong Bayanihan</span>
                    <span className="text-[10px] text-slate-200">Helps send youth delegates to camp</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/15">
                  <span className="w-8 h-8 rounded-lg bg-highlight-red/30 text-amber-200 flex items-center justify-center font-bold text-sm shrink-0">⚡</span>
                  <div className="text-left text-xs">
                    <span className="font-bold text-white block">Instant E-Ticket</span>
                    <span className="text-[10px] text-slate-200">Sent straight to your email</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/15">
                  <span className="w-8 h-8 rounded-lg bg-sky-blue/25 text-sky-200 flex items-center justify-center font-bold text-sm shrink-0"><LockIcon size={14} /></span>
                  <div className="text-left text-xs">
                    <span className="font-bold text-white block">100% Fair Draw</span>
                    <span className="text-[10px] text-slate-200">Every ₱{config?.ticketPrice || 20} ticket gets an equal shot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Interactive Golden Pass Preview Card */}
        <div className="md:col-span-3 lg:col-span-2 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-50 to-white border-2 border-gold/40 shadow-sm flex flex-col justify-between group hover:border-gold transition-all overflow-hidden">
          <WovenRibbon className="h-1.5 w-full" />
          <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
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
                <span className="text-gold font-extrabold">₱{config?.ticketPrice || 20}.00</span>
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
              className="btn-secondary w-full text-xs font-bold flex items-center justify-between px-4 py-2.5"
            >
              <span>Proceed with this pass name</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bento Box 3: Dynamic Live Countdown to Draw */}
        <div className="md:col-span-1 lg:col-span-1 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <WovenRibbon className="h-1.5 w-full" />
          <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-royal-blue">
                Grand Draw Status
              </span>
              <span className="text-xs font-mono font-semibold text-highlight-red">2026</span>
            </div>

            {isDrawLive ? (
              <div className="bg-gradient-to-r from-highlight-red to-amber-500 text-white rounded-2xl p-4 text-center my-2 shadow-md animate-pulse">
                <div className="flex items-center justify-center gap-2">
                  <CelebrationIcon size={20} className="text-white" />
                  <p className="font-heading font-black text-lg">DRAW LIVE NOW!</p>
                </div>
                <p className="text-[11px] opacity-90 mt-1">Winning tickets being drawn on stage</p>
                <Link
                  to="/live"
                  className="btn-secondary inline-block mt-3 text-xs px-4 py-1.5"
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
              Dec 11, 2026 at 1:30 PM &bull; Drawn live on stage with our youth council team.
            </p>
          </div>
        </div>

        {/* Bento Box 4: Official Prizes Quick Card */}
        <div className="md:col-span-2 lg:col-span-1 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-midnight-navy to-[#5C1223] text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <WovenRibbon className="h-1.5 w-full" />
          <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/15 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold bg-white/10 px-2.5 py-0.5 rounded-full">
                  Official Prizes
                </span>
                <span className="text-gold bg-white/10 p-2 rounded-xl flex items-center justify-center">
                  <GiftIcon size={20} />
                </span>
              </div>

              <h3 className="font-heading font-bold text-lg text-white mb-2">
                Major &amp; Minor Rewards
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed mb-4">
                Win Powerbanks, Jisulife Turbo Fans, Aquaflask Tumblers, Starbucks Gift Cards, Earbuds, and Official Merch!
              </p>
            </div>

            <a
              href="#prizes"
              className="btn-woven-gold w-full flex items-center justify-between text-xs px-4 py-2"
            >
              <span>See All Prizes Below</span>
              <span>&darr;</span>
            </a>
          </div>
        </div>

        {/* Bento Box 5: Where Your Entry Goes (Mission Impact) */}
        <div className="md:col-span-2 lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <WovenRibbon className="h-1.5 w-full" />
          <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Where Your ₱{config?.ticketPrice || 20} Goes
              </h3>
              <span className="text-xs font-bold text-highlight-red bg-highlight-red/10 px-3 py-1 rounded-full">
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
                <div className="w-8 h-8 rounded-xl bg-highlight-red/10 text-highlight-red flex items-center justify-center mb-2">
                  <BookOpenIcon size={18} />
                </div>
                <h4 className="font-bold text-xs text-slate-800">Formation Kits</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Funds parish youth ministry guides and materials.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center mb-2">
                  <CelebrationIcon size={18} />
                </div>
                <h4 className="font-bold text-xs text-slate-800">Celebration</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Powers the 40-year milestone Diocesan Youth Day rally.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-3">
              Run by the Diocesan Youth Ministry with open updates after the event.
            </p>
          </div>
        </div>

        {/* Bento Box 6: Fair Draw Engine & Transparency */}
        <div className="md:col-span-1 lg:col-span-2 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-royal-blue/5 via-amber-50/60 to-highlight-red/5 border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <WovenRibbon className="h-1.5 w-full" />
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 flex-grow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-royal-blue text-gold flex items-center justify-center shrink-0 shadow-md border-2 border-gold/40">
                <TargetIcon size={24} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-slate-900 text-sm">
                  Fair &amp; Open Raffle
                </h4>
                <p className="text-xs text-slate-500">
                  Every ticket gets its own unique number—no tricks, just a real live draw anyone can watch.
                </p>
              </div>
            </div>

            <Link
              to="/live"
              className="btn-secondary w-full sm:w-auto text-xs font-bold whitespace-nowrap text-center"
            >
              Watch Live Draw &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Major & Minor Prizes Showcase */}
      <PrizeShowcase />
    </div>
  );
};
