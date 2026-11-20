// Official Major & Minor raffle prizes showcase for the landing page
import React from 'react';
import { RAFFLE_PRIZES, PrizeItem } from '../data/prizes';
import { PrizeVisual } from './PrizeArtwork';
import { GiftIcon, SparklesIcon } from './icons/Icons';

const PrizeCard: React.FC<{ prize: PrizeItem }> = ({ prize }) => {
  const isMajor = prize.tier === 'major';

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all hover:shadow-md ${
        isMajor
          ? 'bg-gradient-to-b from-amber-50/70 via-white to-white border-gold/40 hover:border-gold'
          : 'bg-white border-slate-200 hover:border-royal-blue/40'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              isMajor
                ? 'bg-midnight-navy text-gold'
                : 'bg-royal-blue/10 text-royal-blue'
            }`}
          >
            {prize.rankLabel}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {prize.brandOrType}
          </span>
        </div>

        {/* Prize Visual Container */}
        <div
          className={`w-full rounded-xl flex items-center justify-center mb-3.5 overflow-hidden ${
            prize.imageSrc
              ? isMajor
                ? 'h-40 sm:h-44 bg-white border border-gold/25 shadow-inner'
                : 'h-32 sm:h-36 bg-white border border-slate-100'
              : isMajor
                ? 'h-40 sm:h-44 bg-gradient-to-br from-royal-blue/5 via-sky-50 to-amber-50/70 border border-gold/20'
                : 'h-32 sm:h-36 bg-slate-50 border border-slate-100'
          }`}
        >
          <PrizeVisual prize={prize} />
        </div>

        <h4 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-snug">
          {prize.name}
        </h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {prize.description}
        </p>
      </div>

      {prize.shopUrl && (
        <a
          href={prize.shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-between w-full text-xs font-bold text-royal-blue hover:text-midnight-navy bg-royal-blue/5 hover:bg-royal-blue/10 px-3.5 py-2 rounded-xl transition-colors"
        >
          <span>{prize.shopLabel || 'View Prize Reference'}</span>
          <span>&rarr;</span>
        </a>
      )}
    </div>
  );
};

export const PrizeShowcase: React.FC = () => {
  const majorPrizes = RAFFLE_PRIZES.filter((p) => p.tier === 'major');
  const minorPrizes = RAFFLE_PRIZES.filter((p) => p.tier === 'minor');

  return (
    <section id="prizes" className="mb-6 sm:mb-8">
      <div className="rounded-2xl sm:rounded-3xl bg-white/95 border border-slate-200 p-4 sm:p-6 md:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-royal-blue bg-royal-blue/10 px-3 py-1 rounded-full mb-2">
              <GiftIcon size={13} />
              <span>Official Raffle Rewards</span>
            </span>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
              Prizes You Could Win
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              More entries at ₱20 each means even bigger chances to bring one home!
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold bg-midnight-navy px-3.5 py-1.5 rounded-full self-start sm:self-center">
            <SparklesIcon size={14} className="text-gold" />
            <span>Major &amp; Minor Draws</span>
          </span>
        </div>

        {/* Major Prizes Row */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-midnight-navy/60 mb-3">
            Major Prizes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {majorPrizes.map((prize) => (
              <PrizeCard key={prize.id} prize={prize} />
            ))}
          </div>
        </div>

        {/* Minor Prizes Row */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-midnight-navy/60 mb-3">
            Minor Prizes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {minorPrizes.map((prize) => (
              <PrizeCard key={prize.id} prize={prize} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
