// High-fidelity physical golden raffle ticket stub with tear-off notch and verified details
import React, { useState } from 'react';
import { TrophyIcon, ShieldIcon, CheckIcon, CopyIcon } from './icons/Icons';

interface WinningTicketCardProps {
  winner: {
    id: string;
    ticketNumber: string;
    prizeName: string;
    verificationHash: string;
    createdAt: string;
    registration?: {
      fullName: string;
      campName: string;
      email?: string;
    };
  };
  isOperator?: boolean;
  onVoidRequest?: () => void;
  className?: string;
}

export const WinningTicketCard: React.FC<WinningTicketCardProps> = ({
  winner,
  isOperator,
  onVoidRequest,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(winner.verificationHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto transition-all duration-700 animate-appear ${className}`}>
      {/* Trophy Badge Float */}
      <div className="flex justify-center -mb-5 relative z-20">
        <div className="bg-gradient-to-r from-amber-400 via-gold to-yellow-500 text-midnight-navy px-4 py-1.5 rounded-full shadow-[0_0_25px_rgba(245,166,35,0.6)] border-2 border-white flex items-center gap-2 animate-bounce">
          <TrophyIcon size={18} className="text-midnight-navy" />
          <span className="font-heading font-black text-xs uppercase tracking-wider">
            Official Drawn Winner
          </span>
        </div>
      </div>

      {/* The Physical Perforated Ticket Body */}
      <div className="relative bg-gradient-to-br from-[#0B1536] via-[#102257] to-[#08102B] rounded-3xl border-2 border-gold/70 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(245,166,35,0.25)] overflow-hidden text-white pt-6 pb-5 px-4 sm:px-8">
        {/* Holographic foil sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-amber-300/15 pointer-events-none" />

        {/* Top & Bottom Perforation Notches */}
        <div className="hidden sm:block absolute left-[30%] -top-3 w-6 h-6 rounded-full bg-[#030712] border-b-2 border-gold/60" />
        <div className="hidden sm:block absolute left-[30%] -bottom-3 w-6 h-6 rounded-full bg-[#030712] border-t-2 border-gold/60" />

        <div className="grid grid-cols-1 sm:grid-cols-10 gap-4 sm:gap-6 items-center relative z-10">
          {/* Left Stub Section */}
          <div className="sm:col-span-3 sm:border-r-2 sm:border-dashed sm:border-gold/40 sm:pr-4 flex flex-col justify-between items-center sm:items-start text-center sm:text-left space-y-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold font-black block">
                MOPCY DYD 2026
              </span>
              <span className="text-[9px] text-sky-200/70 font-semibold uppercase block">
                40 Years in Mission
              </span>
            </div>

            {/* Barcode graphic */}
            <div className="w-full max-w-[140px] h-9 bg-white/10 rounded px-2 py-1 flex items-center justify-between border border-white/20">
              <div className="flex gap-[2px] h-full items-center opacity-80">
                <span className="w-[2px] h-full bg-white" />
                <span className="w-[1px] h-full bg-white" />
                <span className="w-[3px] h-full bg-white" />
                <span className="w-[1px] h-full bg-white" />
                <span className="w-[2px] h-full bg-white" />
                <span className="w-[4px] h-full bg-white" />
                <span className="w-[1px] h-full bg-white" />
                <span className="w-[2px] h-full bg-white" />
                <span className="w-[3px] h-full bg-white" />
              </div>
              <span className="font-mono text-[9px] text-gold font-bold">STUB</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
              <ShieldIcon size={12} />
              <span>CSPRNG Vaulted</span>
            </div>
          </div>

          {/* Right Main Pass Section */}
          <div className="sm:col-span-7 flex flex-col justify-center text-center sm:text-left space-y-2">
            {/* Prize Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-midnight-navy font-black text-xs uppercase tracking-wider mx-auto sm:mx-0 shadow-md">
              <TrophyIcon size={14} />
              <span className="truncate max-w-[280px] sm:max-w-md">{winner.prizeName}</span>
            </div>

            {/* Ticket Number in Big Bold Gold Mono */}
            <div className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-gold tracking-wider drop-shadow-[0_2px_12px_rgba(245,166,35,0.4)]">
              {winner.ticketNumber}
            </div>

            {/* Winner Details */}
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {winner.registration?.fullName || 'Verified Participant'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-sky-200/90 mt-0.5">
                {winner.registration?.campName || 'General Delegation'}
              </div>
            </div>

            {/* SHA-256 Audit Hash */}
            <div className="pt-2">
              <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                <div className="text-left overflow-hidden">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">
                    Cryptographic Audit Hash
                  </span>
                  <span className="font-mono text-[10px] text-sky-300 font-medium truncate block max-w-[220px] sm:max-w-xs">
                    {winner.verificationHash}
                  </span>
                </div>
                <button
                  onClick={copyHash}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1 shrink-0"
                  title="Copy verification hash"
                >
                  {copied ? <CheckIcon size={13} className="text-emerald-400" /> : <CopyIcon size={13} />}
                  <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Operator Controls inside Card */}
        {isOperator && onVoidRequest && (
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
            <button
              onClick={onVoidRequest}
              className="text-xs px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold transition-all"
            >
              Void &amp; Redraw This Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

