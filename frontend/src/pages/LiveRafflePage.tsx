import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const LiveRafflePage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [winner, setWinner] = useState<any | null>(null);
  const [displayIndex, setDisplayIndex] = useState<number>(0);
  
  // Audio references (optional, can be added later)
  const shuffleIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets/all');
      if (res.success && res.data) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startDraw = () => {
    if (tickets.length === 0) return;
    
    setIsShuffling(true);
    setWinner(null);
    
    // Rapidly cycle through tickets
    shuffleIntervalRef.current = window.setInterval(() => {
      setDisplayIndex(Math.floor(Math.random() * tickets.length));
    }, 50);

    // Stop and pick a winner after 4 seconds
    setTimeout(() => {
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
      
      const winningIndex = Math.floor(Math.random() * tickets.length);
      setDisplayIndex(winningIndex);
      setWinner(tickets[winningIndex]);
      setIsShuffling(false);
    }, 4000);
  };

  if (loading) return <LoadingSpinner message="Loading entries..." />;

  const currentDisplay = tickets.length > 0 ? tickets[displayIndex] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations specific to raffle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-gold/20 via-transparent to-transparent opacity-40 blur-3xl pointer-events-none"></div>

      <div className="z-10 text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-midnight-navy/10 bg-midnight-navy/5 backdrop-blur-md mx-auto">
          <span className="text-sm font-medium text-midnight-navy/80">🎟️ Live Draw</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-heading font-semibold gradient-text mb-4">DYD 2026 Grand Raffle</h1>
        <p className="text-xl text-midnight-navy/60 font-medium">
          {tickets.length} valid entries ready
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="card max-w-md w-full text-center p-8 z-10">
          <p className="text-lg text-midnight-navy/60">No approved tickets found yet.</p>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center">
          
          {/* The Raffle Drum / Circle */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full flex items-center justify-center mb-12 overflow-hidden shadow-2xl transition-all duration-500 bg-midnight-navy/80 border-8 border-gold/30 backdrop-blur-xl">
            
            {/* Inner rotating flush effect */}
            {isShuffling && (
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 via-transparent to-gold/40 animate-spin" style={{ animationDuration: '0.3s' }}></div>
            )}
            
            {/* The Ticket Information */}
            <div className={`relative z-10 text-center p-6 ${isShuffling ? 'scale-110 opacity-80 blur-[1px]' : 'scale-100'} transition-all duration-75`}>
              {winner && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce text-4xl">
                  🎉
                </div>
              )}
              
              <div className="font-mono text-2xl sm:text-4xl font-bold text-midnight-navy mb-2 tracking-wider">
                {currentDisplay?.ticketNumber}
              </div>
              <div className={`text-lg sm:text-xl font-semibold text-royal-blue ${isShuffling ? 'opacity-0' : 'opacity-100 animate-appear'}`}>
                {currentDisplay?.registration.fullName}
              </div>
              <div className={`text-sm text-midnight-navy/60 mt-1 ${isShuffling ? 'opacity-0' : 'opacity-100 animate-appear delay-100'}`}>
                {currentDisplay?.registration.campName}
              </div>
            </div>
            
            {/* Winner Ring Pulse */}
            {winner && (
              <div className="absolute inset-0 border-8 border-gold rounded-full animate-ping opacity-50"></div>
            )}
          </div>

          {!winner && !isShuffling && (
            <button onClick={startDraw} className="btn-primary text-xl px-12 py-5 animate-appear-zoom shadow-[0_0_40px_rgba(245,166,35,0.4)]">
              Draw Winner
            </button>
          )}

          {winner && (
            <div className="flex gap-4 animate-appear delay-300">
              <button onClick={() => setWinner(null)} className="btn-secondary px-8 py-3">
                Reset
              </button>
              <button onClick={startDraw} className="btn-primary px-8 py-3">
                Draw Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
