import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Registration, Ticket } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';

export const TicketsPage: React.FC = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [data, setData] = useState<{ registration: Registration; tickets: Ticket[] } | null>(null);

  useEffect(() => {
    if (token && orderId) {
      setLoading(true);
      api.get<{ registration: Registration; tickets: Ticket[] }>(`/tickets/${orderId}?token=${token}`)
        .then(res => {
          if (res.success && res.data) {
            setData(res.data);
          } else {
            setError(res.error || 'Failed to load tickets');
          }
        })
        .catch(() => setError('Network error'))
        .finally(() => setLoading(false));
    }
  }, [token, orderId]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-email', { email, orderId });
      if (res.success) {
        setVerificationSent(true);
      } else {
        setError(res.error || 'Verification failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md animate-appear">
        <div className="card text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-radial-gradient from-gold/10 to-transparent opacity-50 blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl font-heading font-semibold mb-6 gradient-text relative z-10">Access E-Tickets</h2>
          
          {verificationSent ? (
            <div className="text-center p-6 bg-midnight-navy/5 border border-midnight-navy/10 rounded-xl relative z-10">
              <p className="text-gold font-medium">Verification link sent to your email.</p>
              <p className="text-sm text-midnight-navy/50 mt-2">Please check your inbox.</p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6 relative z-10 text-left">
              <p className="text-midnight-navy/60 text-sm mb-4 leading-relaxed">Enter your registered email to receive a secure access link for order <br/><span className="font-mono text-midnight-navy bg-midnight-navy/10 px-2 py-1 rounded mt-2 inline-block border border-midnight-navy/5">{orderId}</span></p>
              <div>
                <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="input-field" 
                  placeholder="Enter email address" 
                  required 
                />
              </div>
              {error && <p className="text-highlight-red text-sm">{error}</p>}
              <button type="submit" className="w-full btn-primary py-3" disabled={loading}>
                {loading ? 'Sending...' : 'Send Access Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner message="Loading tickets..." />;
  if (error) return <div className="text-center py-16 text-highlight-red">{error}</div>;
  if (!data) return null;

  const { registration, tickets } = data;

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-4xl animate-appear">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-heading font-semibold gradient-text mb-2">Your Tickets</h1>
          <p className="text-midnight-navy/50 text-sm">Order ID: <span className="font-mono text-midnight-navy/80">{registration.id}</span></p>
        </div>
        <StatusBadge status={registration.status} />
      </div>

      <div className="card mb-10 bg-midnight-navy/[0.02]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-midnight-navy/40 uppercase tracking-wider mb-1 text-xs font-semibold">Name</p>
            <p className="font-medium text-midnight-navy/90 text-lg">{registration.fullName}</p>
          </div>
          <div>
            <p className="text-midnight-navy/40 uppercase tracking-wider mb-1 text-xs font-semibold">Camp</p>
            <p className="font-medium text-midnight-navy/90 text-lg">{registration.campName}</p>
          </div>
          <div>
            <p className="text-midnight-navy/40 uppercase tracking-wider mb-1 text-xs font-semibold">Total Tickets</p>
            <p className="font-semibold text-gold text-xl">{registration.ticketCount}</p>
          </div>
        </div>
      </div>

      {registration.status === 'pending' && (
        <div className="p-8 text-center bg-midnight-navy/5 border border-yellow-500/20 rounded-2xl animate-appear-zoom">
          <h3 className="text-xl font-semibold text-yellow-500 mb-2">Verification in Progress</h3>
          <p className="text-midnight-navy/60">Please wait while our team verifies your payment details.</p>
        </div>
      )}

      {registration.status === 'rejected' && (
        <div className="p-8 text-center bg-midnight-navy/5 border border-red-500/20 rounded-2xl animate-appear-zoom">
          <h3 className="text-xl font-semibold text-red-500 mb-2">Registration Issue</h3>
          <p className="text-midnight-navy/60">We could not approve your registration.</p>
          {registration.rejectionNote && <p className="text-midnight-navy/80 mt-4 bg-midnight-navy/10 p-4 rounded-xl border border-midnight-navy/5 text-sm">Reason: {registration.rejectionNote}</p>}
        </div>
      )}

      {registration.status === 'approved' && tickets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tickets.map((ticket, i) => (
            <div key={ticket.id} className="card relative overflow-hidden group hover:border-gold/30 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <span className="font-heading font-bold text-8xl">#{i+1}</span>
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <p className="text-gold font-medium text-xs tracking-[0.2em] uppercase mb-2">Admit One</p>
                <h3 className="text-2xl font-heading font-semibold mb-6 text-midnight-navy/90">DYD 2026 Raffle Ticket</h3>
                
                <div className="flex-grow">
                  <div className="bg-midnight-navy/5 px-4 py-3 rounded-xl inline-block mb-8 font-mono text-xl tracking-widest border border-midnight-navy/10 shadow-inner">
                    {ticket.ticketNumber}
                  </div>
                </div>
                
                <div>
                  <button className="btn-secondary py-3 text-sm w-full flex items-center justify-center gap-2 group-hover:bg-midnight-navy/10">
                    <svg className="w-5 h-5 text-midnight-navy/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download E-Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
