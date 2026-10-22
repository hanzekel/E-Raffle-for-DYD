// Live stage raffle draw with audience spectator mode, realtime entry pool, and stage controls
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LockIcon, ShieldIcon, DiceIcon, TicketIcon, ExpandIcon, CompressIcon } from '../components/icons/Icons';
import { EligiblePoolTicket } from '../types';
import { FlyingTicketsVortex } from '../components/FlyingTicketsVortex';
import { WinningTicketCard } from '../components/WinningTicketCard';

const PRESET_PRIZES = [
  'Grand Prize: Brand New Scooter + ₱20,000',
  '2nd Prize: Apple iPad Bundle + Pencil',
  '3rd Prize: ₱15,000 Cash Prize',
  'Consolation Prize: ₱1,000 Cash',
  'Special Youth Camp Fellowship Award',
];

export const LiveRafflePage: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const [previewAsPublic, setPreviewAsPublic] = useState(false);
  const [isStageMode, setIsStageMode] = useState(false);

  const [tickets, setTickets] = useState<EligiblePoolTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [winner, setWinner] = useState<any | null>(null);
  const [selectedPrize, setSelectedPrize] = useState<string>(PRESET_PRIZES[0]);
  const [customPrize, setCustomPrize] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Stage Void & Redraw state
  const [stageVoidOpen, setStageVoidOpen] = useState(false);
  const [stageVoidReason, setStageVoidReason] = useState('');
  const [stageVoidError, setStageVoidError] = useState('');
  const [isStageVoiding, setIsStageVoiding] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get<EligiblePoolTicket[]>('/tickets/all');
      if (res.success && res.data) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets().finally(() => setLoading(false));

    // Real-time polling every 10 seconds for newly approved entries
    const pollInterval = setInterval(() => {
      fetchTickets();
    }, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  // Sync fullscreen state with browser events
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setIsStageMode(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Toggle stage fullscreen presentation mode
  const toggleStageMode = async () => {
    if (!isStageMode) {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        // Fallback gracefully if browser policy requires user direct gesture
      }
      setIsStageMode(true);
    } else {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch (err) {
        // Safe fallback
      }
      setIsStageMode(false);
    }
  };

  // Server-side cryptographic draw execution
  const executeServerDraw = async () => {
    const prize = customPrize.trim() || selectedPrize;
    if (!prize) {
      setErrorMsg('Please select or specify a prize name before drawing.');
      return;
    }

    setErrorMsg('');
    setIsShuffling(true);
    setWinner(null);

    try {
      // Trigger server CSPRNG draw in backend vault
      const drawPromise = api.post<any>('/admin/draw', { prizeName: prize });
      
      // Minimum 3.5 seconds of suspense animation for audience
      const delayPromise = new Promise(resolve => setTimeout(resolve, 3500));
      
      const [res] = await Promise.all([drawPromise, delayPromise]);

      if (res.success && res.data) {
        setWinner(res.data);
        fetchTickets(); // Refresh remaining tickets in pool
      } else {
        throw new Error((res.error as any)?.message || res.error || 'Failed to complete server draw');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during draw');
    } finally {
      setIsShuffling(false);
    }
  };

  // Void winning draw on stage and optionally trigger instant redraw
  const handleStageVoidAndRedraw = async (shouldImmediateRedraw = false) => {
    if (!winner?.id) return;
    const cleanReason = stageVoidReason.trim();
    if (cleanReason.length < 5) {
      setStageVoidError('Audit note must be at least 5 characters (e.g. absent, disqualified).');
      return;
    }

    setIsStageVoiding(true);
    setStageVoidError('');

    try {
      const res = await api.post('/admin/draw/void', {
        winnerId: winner.id,
        voidReason: cleanReason,
      });

      if (res.success) {
        setStageVoidOpen(false);
        setStageVoidReason('');
        setWinner(null);
        await fetchTickets();

        if (shouldImmediateRedraw) {
          executeServerDraw();
        }
      } else {
        setStageVoidError((res.error as any)?.message || res.error || 'Failed to void draw.');
      }
    } catch {
      setStageVoidError('Network error while connecting to vault.');
    } finally {
      setIsStageVoiding(false);
    }
  };

  if (loading) return <LoadingSpinner message="Connecting to Raffle Vault..." />;

  // Whether active draw controls are displayed
  const isOperatorActive = isAdmin && !previewAsPublic;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-3 sm:p-5 md:p-6 relative overflow-hidden pb-12">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-gradient from-gold/20 via-transparent to-transparent opacity-40 blur-3xl pointer-events-none" />

      {/* Role Banner: Clearly identifies current user vs admin */}
      <div className="z-20 w-full max-w-2xl mb-4 sm:mb-6">
        {isAdmin ? (
          <div className="bg-midnight-navy text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-gold/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2.5 animate-appear">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <span className="text-xs font-bold text-gold flex items-center gap-1.5">
                  <ShieldIcon size={14} />
                  <span>{isOperatorActive ? 'Logged in as Admin (Stage Operator)' : 'Admin Previewing Public View'}</span>
                </span>
                <span className="text-[10px] text-slate-300 block">
                  {isOperatorActive ? 'Draw controls enabled' : 'Controls hidden for audience perspective'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={toggleStageMode}
                className="text-xs px-2.5 py-1 rounded-lg bg-gold/20 border border-gold/40 text-gold font-bold hover:bg-gold/30 transition-colors inline-flex items-center gap-1.5"
                title="Enter Fullscreen Stage Mode for Projector/LED Wall"
              >
                <ExpandIcon size={14} />
                <span>Stage Mode</span>
              </button>
              <button
                onClick={() => setPreviewAsPublic(!previewAsPublic)}
                className="text-xs px-2.5 py-1 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-slate-200"
              >
                {previewAsPublic ? 'Show Operator Controls' : 'Preview Public View'}
              </button>
              <Link
                to="/admin/dashboard"
                className="text-xs px-2.5 py-1 rounded-lg bg-royal-blue text-white font-semibold hover:bg-royal-blue-dark transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-xs px-2 py-1 rounded text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur border border-slate-200 px-3.5 py-2 rounded-xl text-center text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Public Spectator Mode (Audience View)</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleStageMode}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 font-semibold transition-colors inline-flex items-center gap-1.5"
                title="Enter Fullscreen Stage Mode"
              >
                <ExpandIcon size={13} />
                <span>Stage Fullscreen</span>
              </button>
              <Link to="/admin/login" className="text-royal-blue font-bold hover:underline text-[11px]">
                Stage Operator Login &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Top Header */}
      <div className="z-10 text-center mb-4 sm:mb-8 pt-1">
        <div className="inline-flex items-center gap-1.5 mb-2 sm:mb-3 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-md mx-auto">
          <span className="text-[11px] sm:text-xs font-bold text-royal-blue uppercase tracking-wider inline-flex items-center gap-1.5">
            <LockIcon size={14} />
            <span>Official Verified Raffle Draw</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-heading font-black gradient-text leading-tight py-1 mb-1.5 sm:mb-2">
          DYD 2026 Grand Raffle Draw
        </h1>
        <p className="text-xs sm:text-base text-slate-600 font-medium">
          {tickets.length} approved eligible entries ready for the draw
        </p>
      </div>

      {/* Admin Controller Bar (Only visible if Admin is actively in Operator mode) */}
      {isOperatorActive && (
        <div className="z-20 w-full max-w-2xl bg-midnight-navy text-white p-4 sm:p-5 rounded-2xl border-2 border-gold/50 shadow-2xl mb-6 sm:mb-8 animate-appear">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
            <span className="font-bold text-gold flex items-center gap-1.5">
              <DiceIcon size={16} />
              <span>Stage Draw Controls</span>
            </span>
            <span className="text-emerald-400 font-semibold text-[11px]">CSPRNG Vault Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-slate-300 block mb-1 font-semibold">Select Prize Category:</label>
              <select
                value={selectedPrize}
                onChange={(e) => {
                  setSelectedPrize(e.target.value);
                  setCustomPrize('');
                }}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold"
              >
                {PRESET_PRIZES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
                <option value="">-- Custom Prize --</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-semibold">Custom Name:</label>
              <input
                type="text"
                value={customPrize}
                onChange={(e) => setCustomPrize(e.target.value)}
                placeholder="Or type custom prize"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-300">
              Target Prize: <strong className="text-gold">{customPrize || selectedPrize}</strong>
            </span>
            <button
              onClick={executeServerDraw}
              disabled={isShuffling || tickets.length === 0}
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold disabled:opacity-50 w-full sm:w-auto"
            >
              {isShuffling ? (
                'Drawing Winner...'
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  <span>Draw Winner Live</span>
                  <DiceIcon size={16} />
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="z-20 max-w-md w-full bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-center text-xs mb-6">
          {errorMsg}
        </div>
      )}

      {/* 3D Flying Tickets Raffle Chamber */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center mb-6">
        <FlyingTicketsVortex
          tickets={tickets}
          isShuffling={isShuffling}
          winner={winner}
          className="w-full"
        />

        {/* Drawn Golden Ticket Presentation */}
        {winner && (
          <div className="w-full mt-4 animate-appear space-y-3">
            <WinningTicketCard
              winner={winner}
              isOperator={isOperatorActive}
              onVoidRequest={() => {
                setStageVoidOpen(true);
                setStageVoidReason('');
                setStageVoidError('');
              }}
            />

            {/* Stage Operator Quick Next Action */}
            {isOperatorActive && (
              <div className="flex justify-center gap-3 pt-1">
                <button
                  onClick={() => setWinner(null)}
                  className="px-4 py-2 rounded-xl bg-royal-blue hover:bg-royal-blue-dark text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <span>Draw Next Prize &rarr;</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Eligible Ticket Entries Ledger (Public Transparency) */}
      <section className="w-full max-w-4xl z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
              <TicketIcon size={20} className="text-royal-blue" />
              <span>Eligible Ticket Pool</span>
            </h2>
            <p className="text-xs text-slate-500">
              Approved tickets active in the raffle pool. Names masked for privacy.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full whitespace-nowrap">
            {tickets.length} Approved Entries
          </span>
        </div>

        <div className="card overflow-hidden p-0 border border-slate-200 bg-white">
          {/* Desktop Entries Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="p-3.5 lg:p-4">Ticket Number</th>
                  <th className="p-3.5 lg:p-4">Participant Name</th>
                  <th className="p-3.5 lg:p-4">Camp</th>
                  <th className="p-3.5 lg:p-4">Registered Date</th>
                  <th className="p-3.5 lg:p-4 text-right">Pool Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 lg:p-4 font-mono font-bold text-royal-blue text-sm">
                      {t.ticketNumber}
                    </td>
                    <td className="p-3.5 lg:p-4 font-medium text-slate-800">
                      {t.registration.fullName}
                    </td>
                    <td className="p-3.5 lg:p-4 text-slate-600">
                      {t.registration.campName}
                    </td>
                    <td className="p-3.5 lg:p-4 text-slate-500 font-mono text-[11px]">
                      {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 lg:p-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Eligible</span>
                      </span>
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400">
                      No eligible entries yet. Approved registrations will appear here in real-time.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Entries Card List */}
          <div className="block md:hidden divide-y divide-slate-100">
            {tickets.map((t) => (
              <div key={t.id} className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-royal-blue text-sm">
                    {t.ticketNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Eligible</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-medium">{t.registration.fullName}</span>
                  <span className="text-slate-500 text-[11px]">{t.registration.campName}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="p-6 text-center text-slate-400 text-xs">
                No eligible entries yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stage Fullscreen Presentation Overlay (LED Wall / Big Screen) */}
      {isStageMode && (
        <div className="fixed inset-0 z-[100] bg-[#030712] bg-gradient-to-b from-[#050B1E] via-[#0A1845] to-[#030712] text-white flex flex-col justify-between p-4 sm:p-8 select-none overflow-y-auto">
          {/* Top Bar: Event Branding + Pool counter + Exit button */}
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto z-20">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]" />
              <div>
                <span className="font-heading font-black text-sm sm:text-lg tracking-wider text-gold uppercase block">
                  DYD 2026 Live Raffle Stage
                </span>
                <span className="text-[11px] sm:text-xs text-sky-200/80 font-medium">
                  {tickets.length} Approved Entries in Vault Pool
                </span>
              </div>
            </div>

            <button
              onClick={toggleStageMode}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 backdrop-blur shadow-lg active:scale-95"
              title="Exit Stage Mode (Esc)"
            >
              <CompressIcon size={16} />
              <span>Exit Stage View</span>
            </button>
          </div>

          {/* Center Stage Presentation: 3D Flying Tickets Chamber */}
          <div className="flex-1 flex flex-col items-center justify-center my-2 sm:my-4 relative z-10 w-full max-w-4xl mx-auto">
            {/* Background Stage Glow */}
            <div className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] bg-royal-blue/20 rounded-full blur-[120px] pointer-events-none" />

            {/* 3D Flying Chamber */}
            <FlyingTicketsVortex
              tickets={tickets}
              isShuffling={isShuffling}
              winner={winner}
              className="w-full max-w-3xl"
            />

            {/* Stage Winner Golden Stub Reveal */}
            {winner && (
              <div className="w-full max-w-2xl mt-4 z-20 animate-appear space-y-2">
                <WinningTicketCard
                  winner={winner}
                  isOperator={isOperatorActive}
                  onVoidRequest={() => {
                    setStageVoidOpen(true);
                    setStageVoidReason('');
                    setStageVoidError('');
                  }}
                />
              </div>
            )}
          </div>

          {/* Bottom Dock: Controls (if Operator) or Spectator Info */}
          <div className="w-full max-w-4xl mx-auto z-20">
            {errorMsg && (
              <div className="mb-3 max-w-lg mx-auto bg-rose-500/90 backdrop-blur border border-rose-300 text-white text-xs p-2.5 rounded-xl text-center shadow-xl animate-appear">
                {errorMsg}
              </div>
            )}
            {isOperatorActive ? (
              <div className="bg-slate-900/90 backdrop-blur-xl border border-gold/40 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Selected Prize:</span>
                    <span className="text-xs sm:text-sm font-extrabold text-gold truncate max-w-xs block">
                      {customPrize || selectedPrize}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {winner && (
                    <button
                      onClick={() => {
                        setStageVoidOpen(true);
                        setStageVoidReason('');
                        setStageVoidError('');
                      }}
                      disabled={isShuffling}
                      className="px-4 py-2.5 rounded-full text-xs font-bold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 transition-all shadow-md active:scale-95"
                    >
                      Void / Redraw
                    </button>
                  )}
                  <button
                    onClick={executeServerDraw}
                    disabled={isShuffling || tickets.length === 0}
                    className="btn-primary py-2.5 px-6 sm:px-8 text-xs sm:text-sm font-black disabled:opacity-50 w-full sm:w-auto shadow-lg shadow-royal-blue/30 inline-flex items-center justify-center gap-2"
                  >
                    {isShuffling ? (
                      'Drawing Winner...'
                    ) : (
                      <>
                        <span>Draw Winner Live</span>
                        <DiceIcon size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-400 font-medium py-1">
                Official Live Raffle Draw &bull; Verified Cryptographic CSPRNG Vault &bull; DYD 2026
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stage Void & Redraw Modal */}
      {stageVoidOpen && winner && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-3 sm:p-4 animate-appear select-none"
          onClick={() => setStageVoidOpen(false)}
        >
          <div 
            className="card bg-slate-900 border-2 border-rose-500/60 text-white max-w-lg w-full p-5 sm:p-7 shadow-[0_0_50px_rgba(244,63,94,0.3)] relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]" />
                <h3 className="font-heading font-black text-base sm:text-lg text-white">
                  Void &amp; Redraw Winner
                </h3>
              </div>
              <button 
                onClick={() => setStageVoidOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Prize Being Drawn:</span>
                <span className="font-bold text-gold">{winner.prizeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Drawn Ticket:</span>
                <span className="font-mono font-bold text-sky-400">{winner.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Participant:</span>
                <span className="font-semibold text-white">{winner.registration?.fullName || '---'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Camp:</span>
                <span className="text-slate-300">{winner.registration?.campName || '---'}</span>
              </div>
            </div>

            {stageVoidError && (
              <div className="mb-4 bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs p-3 rounded-xl animate-appear">
                {stageVoidError}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Mandatory Audit Note <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={stageVoidReason}
                onChange={e => setStageVoidReason(e.target.value)}
                placeholder="Enter void reason (e.g. 'Participant not present after 3 calls', 'Duplicate / disqualified')"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 h-24 resize-none"
                required
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Recorded permanently in the official audit trail (min. 5 characters).
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                onClick={() => setStageVoidOpen(false)}
                disabled={isStageVoiding}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStageVoidAndRedraw(false)}
                disabled={isStageVoiding}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 transition-colors"
              >
                {isStageVoiding ? 'Voiding...' : 'Void Only'}
              </button>
              <button
                onClick={() => handleStageVoidAndRedraw(true)}
                disabled={isStageVoiding}
                className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-900/50 transition-all active:scale-95"
              >
                {isStageVoiding ? 'Voiding...' : 'Void & Redraw Live Now →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
