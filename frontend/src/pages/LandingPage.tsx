// frontend/src/pages/LandingPage.tsx
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
import { RaffleGuideSection } from '../components/RaffleGuideSection';
import {
  WinterSnowflakesOverlay,
  PineTreeGiftsArt,
  OrnamentGarland,
} from '../components/FilipinoMotifs';

export const LandingPage: React.FC = () => {
  const { config } = useConfig();

  // Interactive ticket preview state passed to registration prefill
  const [demoName, setDemoName] = useState<string>('');
  const [demoCamp, setDemoCamp] = useState<string>('');

  // Target draw date from config or Dec 11, 2026 1:30 PM PHT fallback
  const targetDateStr = config?.drawDate || '2026-12-11T13:30:00+08:00';

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

  const getRegisterLink = () => {
    const params = new URLSearchParams();
    if (demoName.trim()) params.set('name', demoName.trim());
    if (demoCamp.trim()) params.set('camp', demoCamp.trim());
    const query = params.toString();
    return query ? `/register?${query}` : '/register';
  };

  const ticketPrice = config?.ticketPrice || 20;
  const maxTickets = config?.maxTickets || 10;

  return (
    <div className="flex flex-col w-full pb-8 sm:pb-12 pt-1 sm:pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Live Status Header Ticker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-5 pb-2.5 sm:pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-slate-800">
            Raffle Now Open &bull; Diocesan Youth Day 2026
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-semibold text-royal-blue bg-white/90 border border-royal-blue/15 px-2.5 sm:px-3 py-1 rounded-full shadow-sm">
            {typeof config?.eligibleEntries === 'number' ? `${config.eligibleEntries} Tickets In The Draw` : '40 Years in Mission'}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-white bg-[#C81D25] px-2.5 sm:px-3 py-1 rounded-full shadow-sm">
            ₱{ticketPrice} / Entry
          </span>
        </div>
      </div>

      {/* Main Editorial Storyboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-min mb-6 sm:mb-8">
        {/* 1. Frost-Sky Hero Card */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#D5ECF9] via-[#E9F5FC] to-white/95 text-midnight-navy shadow-xl relative overflow-hidden border border-white p-5 sm:p-7 md:p-8">
          <WinterSnowflakesOverlay className="absolute inset-0 w-full h-full opacity-95" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Copy & CTA Buttons */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 bg-white/85 backdrop-blur border border-[#C81D25]/25 text-[#B91C1C] text-[11px] sm:text-xs font-extrabold px-3 py-1 rounded-full mb-3 shadow-sm">
                <SparklesIcon size={14} className="text-[#C81D25]" />
                <span>Hello Kalakbay!</span>
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight py-1 text-midnight-navy mb-2">
                One Ticket. <span className="text-[#C81D25]">One Mission.</span>
              </h1>

              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed max-w-xl mb-3">
                Join the official Diocesan Youth Day 2026 raffle for only{' '}
                <strong className="text-royal-blue">₱{ticketPrice}</strong> per entry—more tickets mean even more chances of winning!
              </p>

              <p className="text-[11px] sm:text-xs font-semibold italic text-midnight-navy/80 mb-5">
                &ldquo;But take courage! I have overcome the world.&rdquo; &mdash; John 16:33
              </p>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Link
                  to={getRegisterLink()}
                  aria-label={`Get raffle e-tickets for ${ticketPrice} pesos`}
                  className="btn-festive-red text-center"
                >
                  Get E-Tickets &bull; ₱{ticketPrice}
                </Link>
                <Link
                  to="/verify"
                  aria-label="Check status of my existing tickets"
                  className="btn-secondary text-center"
                >
                  Check My Tickets
                </Link>
              </div>
            </div>

            {/* Right Illustration & Quick Highlights */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white shadow-sm">
              <PineTreeGiftsArt className="w-56 sm:w-64 h-auto" />
              <div className="grid grid-cols-3 gap-2 w-full mt-2 pt-2 border-t border-slate-200/70 text-center">
                <div>
                  <span className="block font-heading font-bold text-xs text-royal-blue">100%</span>
                  <span className="block text-[10px] text-slate-500">Youth Mission</span>
                </div>
                <div>
                  <span className="block font-heading font-bold text-xs text-[#C81D25]">Instant</span>
                  <span className="block text-[10px] text-slate-500">PDF E-Tickets</span>
                </div>
                <div>
                  <span className="block font-heading font-bold text-xs text-emerald-700">Live</span>
                  <span className="block text-[10px] text-slate-500">Stage Draw</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Dark Twilight + Crimson Split Countdown Strip */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-white/40 grid grid-cols-1 md:grid-cols-12">
          {/* Left Panel */}
          <div className="md:col-span-5 bg-[#1F242B]/95 text-white p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
            <OrnamentGarland className="w-full h-14 -mt-4 opacity-95" />
            <div className="mt-2">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-gold">
                Grand Raffle Draw
              </span>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-white mt-0.5">
                December 11, 2026 &bull; 1:30 PM
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Drawn live on stage with our youth council team—every ₱{ticketPrice} entry gets an equal shot.
              </p>
            </div>
          </div>

          {/* Right Crimson Countdown Panel */}
          <div className="md:col-span-7 bg-gradient-to-br from-[#C8232C] to-[#991B1B]/95 text-white p-4 sm:p-6 flex flex-col justify-center relative overflow-hidden">
            {isDrawLive ? (
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CelebrationIcon size={22} className="text-gold-light" />
                    <p className="font-heading font-black text-xl">GRAND DRAW LIVE NOW!</p>
                  </div>
                  <p className="text-xs text-amber-100 mt-1">Winning raffle tickets are being drawn live on stage</p>
                </div>
                <Link to="/live" className="btn-festive-gold text-xs whitespace-nowrap">
                  Watch Live Draw &rarr;
                </Link>
              </div>
            ) : (
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-amber-200 mb-3 text-center sm:text-left">
                  Countdown To The Live Stage Draw
                </p>
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  {[
                    { val: timeLeft.days, label: 'DAYS' },
                    { val: timeLeft.hours, label: 'HOURS' },
                    { val: timeLeft.minutes, label: 'MINS' },
                    { val: timeLeft.seconds, label: 'SECS' },
                  ].map((slot) => (
                    <div key={slot.label} className="bg-black/20 backdrop-blur-sm rounded-xl py-2.5 px-1 border border-white/15">
                      <span className="font-heading font-black text-2xl sm:text-3xl text-white block leading-none">
                        {String(slot.val).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-amber-200 mt-1.5 block">
                        {slot.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Interactive Golden Ticket Preview Card */}
        <div className="md:col-span-3 lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-gold/45 p-4 sm:p-6 shadow-sm flex flex-col justify-between group hover:border-gold transition-all">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-midnight-navy px-2.5 py-0.5 rounded-full">
                  Sample Ticket Preview
                </span>
                <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 mt-1.5">
                  Official Ticket Preview
                </h2>
              </div>
              <span className="text-[#C81D25] bg-[#C81D25]/10 p-2 sm:p-2.5 rounded-xl flex items-center justify-center">
                <TicketIcon size={20} />
              </span>
            </div>

            <div className="bg-slate-50/90 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-dashed border-slate-300 shadow-inner font-mono text-xs mb-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-bold text-royal-blue">MOPCY-DYD26-PASS</span>
                <span className="text-[#C81D25] font-extrabold">₱{ticketPrice}.00</span>
              </div>
              <div className="py-2.5 text-[11px] text-slate-700 space-y-1">
                <p>
                  NAME: <span className="font-bold text-slate-900">{demoName.trim() || 'YOUR NAME HERE'}</span>
                </p>
                <p>
                  CAMP: <span className="font-semibold text-royal-blue">{demoCamp.trim() || 'PARISH YOUTH DELEGATION'}</span>
                </p>
                <p>
                  DRAW: <span className="text-emerald-700 font-semibold">VERIFIED ENTRY &bull; 40Y MISSION</span>
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                <span className="tracking-widest">||| |||| | ||| ||||</span>
                <span className="inline-flex items-center gap-1.5 font-medium"><LockIcon size={12} className="text-slate-500" /> VERIFIED UNIQUE NUMBER</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5 mb-3">
              <span className="text-[10px] text-slate-500 font-bold block">
                Try customizing your preview pass:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  placeholder="Type your full name..."
                  aria-label="Preview pass full name"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-royal-blue bg-white"
                />
                <input
                  type="text"
                  value={demoCamp}
                  onChange={(e) => setDemoCamp(e.target.value)}
                  placeholder="Parish or Camp name..."
                  aria-label="Preview pass parish or camp name"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-royal-blue bg-white"
                />
              </div>
            </div>
          </div>

          <Link
            to={getRegisterLink()}
            aria-label="Proceed to register with this pass name"
            className="btn-primary w-full text-xs font-bold flex items-center justify-between px-4 py-2.5"
          >
            <span>Proceed with this pass name</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* 4. Mission Impact Card */}
        <div className="md:col-span-3 lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-royal-blue bg-royal-blue/10 px-2.5 py-0.5 rounded-full">
                  40 Years in Mission
                </span>
                <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 mt-1.5">
                  Where Your ₱{ticketPrice} Goes
                </h2>
              </div>
              <span className="text-xs font-bold text-[#C81D25] bg-[#C81D25]/10 px-3 py-1 rounded-full">
                Mission Transparency
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-2">
              <div className="p-3 rounded-2xl bg-[#E9F5FC]/70 border border-sky-100">
                <div className="w-8 h-8 rounded-xl bg-royal-blue/10 text-royal-blue flex items-center justify-center mb-2">
                  <HandshakeIcon size={18} />
                </div>
                <h3 className="font-bold text-xs text-slate-800">Youth Subsidies</h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Supports participation for youth delegates in need.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100">
                <div className="w-8 h-8 rounded-xl bg-[#C81D25]/10 text-[#C81D25] flex items-center justify-center mb-2">
                  <BookOpenIcon size={18} />
                </div>
                <h3 className="font-bold text-xs text-slate-800">Formation Kits</h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Funds parish youth ministry guides &amp; materials.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100">
                <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center mb-2">
                  <CelebrationIcon size={18} />
                </div>
                <h3 className="font-bold text-xs text-slate-800">40Y Rally</h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Powers the 40th year Diocesan Youth Day celebration.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Two-Tone Quick Actions Banner */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
            <div className="rounded-2xl bg-[#D9EFFA]/85 p-3.5 flex items-center justify-between gap-2 border border-sky-200/60">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-royal-blue text-white flex items-center justify-center shrink-0">
                  <GiftIcon size={18} />
                </span>
                <div>
                  <p className="font-bold text-xs text-midnight-navy">Official Prizes</p>
                  <p className="text-[10px] text-slate-600">Major &amp; Minor Prizes</p>
                </div>
              </div>
              <a
                href="#prizes"
                aria-label="Scroll to see all raffle prizes"
                className="text-xs font-bold text-royal-blue hover:underline whitespace-nowrap"
              >
                View &darr;
              </a>
            </div>

            <div className="rounded-2xl bg-[#C8232C] text-white p-3.5 flex items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-white/15 text-gold-light flex items-center justify-center shrink-0">
                  <TargetIcon size={18} />
                </span>
                <div>
                  <p className="font-bold text-xs text-white">Fair &amp; Open</p>
                  <p className="text-[10px] text-amber-100">Live Stage Draw</p>
                </div>
              </div>
              <Link
                to="/live"
                aria-label="Go to the live raffle draw stage"
                className="btn-festive-gold px-3.5 py-1.5 text-[11px] whitespace-nowrap"
              >
                Watch &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Major & Minor Prizes Showcase */}
      <PrizeShowcase />

      {/* Step-by-Step Instructions & Frequently Asked Questions */}
      <RaffleGuideSection
        ticketPrice={ticketPrice}
        maxTickets={maxTickets}
        gcashNumber={config?.gcashNumber || '09171701054'}
        gcashName={config?.gcashName || 'ANGELA KAYE LUPAC'}
      />
    </div>
  );
};
