// Admin dashboard for verifying registrations and managing entries and winners
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { AdminDashboardData, AdminWinner } from '../types';
import { Logo } from '../components/Logo';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { CelebrationIcon, TrophyIcon, DownloadIcon, TrashIcon } from '../components/icons/Icons';

type TabStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'winners';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [winners, setWinners] = useState<AdminWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [imageModal, setImageModal] = useState<string | null>(null);

  const [voidModalWinner, setVoidModalWinner] = useState<AdminWinner | null>(null);
  const [voidReason, setVoidReason] = useState<string>('');
  const [voidError, setVoidError] = useState<string>('');
  const [isVoiding, setIsVoiding] = useState<boolean>(false);

  // Custom UI Dialog states replacing native browser popups
  const [actionModal, setActionModal] = useState<{
    type: 'approve' | 'reject' | 'delete';
    id: string;
    fullName: string;
    ticketCount?: number;
  } | null>(null);
  const [noticeModal, setNoticeModal] = useState<{
    type: 'info' | 'error' | 'hash';
    title: string;
    message: string;
    hash?: string;
  } | null>(null);
  const [isActionRunning, setIsActionRunning] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const fetchWinners = useCallback(async () => {
    try {
      const res = await api.get<AdminWinner[]>('/admin/winners');
      if (res.success && res.data) {
        setWinners(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchDashboard = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    const statusParam = activeTab !== 'all' && activeTab !== 'winners' ? `&status=${activeTab}` : '';
    try {
      const res = await api.get<AdminDashboardData>(`/admin/dashboard?page=${page}&limit=10&search=${search}${statusParam}`);
      if (res.success && res.data) {
        setData(res.data);
      }
      await fetchWinners();
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [activeTab, search, page, fetchWinners]);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/admin/login');
    } else if (isAuthenticated === true) {
      fetchDashboard(true);

      // Auto-refresh automatically every 6 seconds so incoming submissions and status updates reflect in real-time
      const autoRefreshInterval = setInterval(() => {
        fetchDashboard(false);
      }, 6000);

      return () => clearInterval(autoRefreshInterval);
    }
  }, [isAuthenticated, fetchDashboard, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Executes pending approve, reject, or delete without browser native alerts/confirms
  const executeActionModal = async () => {
    if (!actionModal) return;
    setIsActionRunning(true);

    try {
      if (actionModal.type === 'approve') {
        const res = await api.post(`/admin/approve/${actionModal.id}`, {});
        if (res.success) {
          setActionModal(null);
          await fetchDashboard(false);
        } else {
          setNoticeModal({
            type: 'error',
            title: 'Approval Failed',
            message: res.error || 'Failed to approve registration. Please verify payment status.',
          });
        }
      } else if (actionModal.type === 'reject') {
        const res = await api.post(`/admin/reject/${actionModal.id}`, {});
        if (res.success) {
          setActionModal(null);
          await fetchDashboard(false);
        } else {
          setNoticeModal({
            type: 'error',
            title: 'Rejection Failed',
            message: res.error || 'Failed to reject registration. Please try again.',
          });
        }
      } else if (actionModal.type === 'delete') {
        // Direct database deletion with NO reason option required
        const res = await api.post(`/admin/delete/${actionModal.id}`, {});
        if (res.success) {
          setActionModal(null);
          await fetchDashboard(false);
          await fetchWinners();
        } else {
          setNoticeModal({
            type: 'error',
            title: 'Deletion Failed',
            message: res.error || 'Failed to delete record from database.',
          });
        }
      }
    } catch {
      setNoticeModal({
        type: 'error',
        title: 'Connection Error',
        message: 'Network error communicating with the server. Please check your internet connection.',
      });
    } finally {
      setIsActionRunning(false);
    }
  };

  const openVoidModal = (winner: AdminWinner) => {
    setVoidModalWinner(winner);
    setVoidReason('');
    setVoidError('');
  };

  const closeVoidModal = () => {
    setVoidModalWinner(null);
    setVoidReason('');
    setVoidError('');
  };

  const executeVoid = async (andRedrawLive = false) => {
    if (!voidModalWinner) return;
    const cleanReason = voidReason.trim();
    if (cleanReason.length < 5) {
      setVoidError('Audit reason must be at least 5 characters (e.g. absent during roll call, disqualified).');
      return;
    }

    setIsVoiding(true);
    setVoidError('');

    try {
      const res = await api.post('/admin/draw/void', {
        winnerId: voidModalWinner.id,
        voidReason: cleanReason,
      });

      if (res.success) {
        closeVoidModal();
        await fetchWinners();
        await fetchDashboard(false);

        if (andRedrawLive) {
          navigate('/live');
        }
      } else {
        setVoidError((res.error as any)?.message || res.error || 'Failed to void draw record. Please try again.');
      }
    } catch {
      setVoidError('Network error while connecting to vault. Please retry.');
    } finally {
      setIsVoiding(false);
    }
  };

  const downloadCsvFile = (content: string, filename: string) => {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCsv = async () => {
    if (activeTab === 'winners') {
      if (winners.length === 0) {
        setNoticeModal({
          type: 'info',
          title: 'Export Notice',
          message: 'No winners have been drawn yet to export.',
        });
        return;
      }
      const headers = ['Prize Name', 'Winning Ticket', 'Winner Name', 'Email', 'Camp', 'Drawn At', 'Audit Hash', 'Status', 'Void Reason'];
      const rows = winners.map(w => [
        `"${w.prizeName.replace(/"/g, '""')}"`,
        `"${w.ticketNumber}"`,
        `"${w.registration.fullName.replace(/"/g, '""')}"`,
        `"${w.registration.email}"`,
        `"${w.registration.campName.replace(/"/g, '""')}"`,
        `"${new Date(w.drawnAt).toLocaleString()}"`,
        `"${w.verificationHash}"`,
        `"${w.isVoided ? 'Voided' : 'Official Winner'}"`,
        `"${(w.voidReason || '').replace(/"/g, '""')}"`,
      ]);
      downloadCsvFile([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), 'dyd2026-winners-audit.csv');
    } else {
      const res = await api.get<AdminDashboardData>('/admin/dashboard?limit=2000');
      const list = res.success && res.data ? res.data.registrations : (data?.registrations || []);
      if (list.length === 0) {
        setNoticeModal({
          type: 'info',
          title: 'Export Notice',
          message: 'No registrations found matching the export criteria.',
        });
        return;
      }
      const headers = ['Full Name', 'Email', 'Camp', 'Tickets Count', 'Payment Method', 'Reference Number', 'Status', 'Registration Date'];
      const rows = list.map(r => [
        `"${r.fullName.replace(/"/g, '""')}"`,
        `"${r.email}"`,
        `"${r.campName.replace(/"/g, '""')}"`,
        r.ticketCount,
        `"${r.paymentMethod.toUpperCase()}"`,
        `"${r.referenceNumber}"`,
        `"${r.status}"`,
        `"${new Date(r.createdAt).toLocaleString()}"`,
      ]);
      downloadCsvFile([headers.join(','), ...rows.map(r => r.join(','))].join('\n'), 'dyd2026-registrations.csv');
    }
  };

  if (isAuthenticated === null || (loading && !data)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-midnight-navy">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  const activeWinners = winners.filter(w => !w.isVoided);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]/30 text-midnight-navy relative z-10">
      {/* Header */}
      <header className="bg-midnight-navy/10 backdrop-blur-xl border-b border-midnight-navy/5 p-2.5 sm:p-4 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Logo size={28} />
          <span className="font-heading font-semibold text-base sm:text-xl text-midnight-navy tracking-wide">DYD26 Admin</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/live" className="text-xs font-bold text-royal-blue bg-royal-blue/10 hover:bg-royal-blue/20 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full transition-colors flex items-center gap-1.5">
            <CelebrationIcon size={14} />
            <span className="hidden sm:inline">Live Draw</span>
            <span className="sm:hidden">Live</span>
          </a>
          <button onClick={handleLogout} className="btn-secondary py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm bg-midnight-navy/5 hover:bg-midnight-navy/10">
            Logout
          </button>
        </div>
      </header>

      <main className="flex-grow p-3 sm:p-4 md:p-5 container mx-auto max-w-7xl animate-appear">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-5">
          <div className="card border-l-4 border-l-royal-blue/80 p-3 sm:p-4">
            <p className="text-midnight-navy/50 text-[11px] sm:text-xs font-medium mb-0.5">Total Submissions</p>
            <p className="text-xl sm:text-3xl font-semibold text-midnight-navy/90">{data?.total || 0}</p>
          </div>
          <div className="card border-l-4 border-l-yellow-500/80 p-3 sm:p-4">
            <p className="text-midnight-navy/50 text-[11px] sm:text-xs font-medium mb-0.5">Pending Review</p>
            <p className="text-xl sm:text-3xl font-semibold text-yellow-600">{data?.pendingCount || 0}</p>
          </div>
          <div className="card border-l-4 border-l-green-500/80 p-3 sm:p-4">
            <p className="text-midnight-navy/50 text-[11px] sm:text-xs font-medium mb-0.5">Eligible Entries</p>
            <p className="text-xl sm:text-3xl font-semibold text-green-600">{data?.eligibleEntries || 0}</p>
          </div>
          <div className="card border-l-4 border-l-red-500/80 p-3 sm:p-4">
            <p className="text-midnight-navy/50 text-[11px] sm:text-xs font-medium mb-0.5">Rejected</p>
            <p className="text-xl sm:text-3xl font-semibold text-red-600">{data?.rejectedCount || 0}</p>
          </div>
          <div className="card border-l-4 border-l-gold/80 p-3 sm:p-4 col-span-2 lg:col-span-1">
            <p className="text-midnight-navy/50 text-[11px] sm:text-xs font-medium mb-0.5">Confirmed Winners</p>
            <p className="text-xl sm:text-3xl font-semibold text-gold">{activeWinners.length}</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex bg-midnight-navy/5 rounded-xl p-1 border border-midnight-navy/10 w-full md:w-auto overflow-x-auto">
            {(['all', 'pending', 'approved', 'rejected', 'winners'] as TabStatus[]).map(tab => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`flex-1 sm:flex-none px-2.5 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-midnight-navy/10 text-gold shadow-sm font-bold' : 'text-midnight-navy/50 hover:text-midnight-navy/80'}`}
              >
                {tab === 'winners' ? `Winners (${activeWinners.length})` : tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab !== 'winners' && (
              <input 
                type="text" 
                placeholder="Search by name or reference..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchDashboard()}
                className="input-field w-full sm:w-72 bg-midnight-navy/5 border-midnight-navy/10 text-xs sm:text-sm py-2 px-3 sm:py-2.5 sm:px-4"
              />
            )}
            <button
              onClick={exportToCsv}
              title={activeTab === 'winners' ? "Export Winners to CSV" : "Export Registrations to CSV"}
              className="btn-secondary py-2 px-3 sm:py-2.5 sm:px-4 text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap bg-midnight-navy/5 hover:bg-midnight-navy/10 border border-midnight-navy/10 font-semibold"
            >
              <DownloadIcon size={15} />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Winners Tab View */}
        {activeTab === 'winners' ? (
          <div className="card overflow-hidden p-0 border border-midnight-navy/10">
            {/* Desktop Winners Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-midnight-navy/5 border-b border-midnight-navy/10 text-midnight-navy/50 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 lg:p-5">Prize</th>
                    <th className="p-4 lg:p-5">Winning Ticket</th>
                    <th className="p-4 lg:p-5">Winner (Unmasked)</th>
                    <th className="p-4 lg:p-5">Camp</th>
                    <th className="p-4 lg:p-5">Drawn At</th>
                    <th className="p-4 lg:p-5">Verification Hash</th>
                    <th className="p-4 lg:p-5">Status</th>
                    <th className="p-4 lg:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-midnight-navy/5">
                  {winners.map(win => (
                    <tr key={win.id} className={`hover:bg-midnight-navy/[0.02] transition-colors ${win.isVoided ? 'opacity-60 bg-red-50/20' : ''}`}>
                      <td className="p-4 lg:p-5 font-bold text-midnight-navy/90 text-sm">
                        <span className="flex items-center gap-1.5">
                          <TrophyIcon size={16} className="text-gold" />
                          <span>{win.prizeName}</span>
                        </span>
                      </td>
                      <td className="p-4 lg:p-5 font-mono font-bold text-royal-blue text-sm">
                        {win.ticketNumber}
                      </td>
                      <td className="p-4 lg:p-5">
                        <p className="font-semibold text-midnight-navy/90 text-sm">{win.registration.fullName}</p>
                        <p className="text-xs text-midnight-navy/50">{win.registration.email}</p>
                      </td>
                      <td className="p-4 lg:p-5 text-sm text-midnight-navy/80">{win.registration.campName}</td>
                      <td className="p-4 lg:p-5 text-xs text-midnight-navy/60 font-mono">
                        {new Date(win.drawnAt).toLocaleString()}
                      </td>
                      <td className="p-4 lg:p-5">
                        <span 
                          title={win.verificationHash}
                          onClick={() => setNoticeModal({
                            type: 'hash',
                            title: 'Cryptographic Audit Hash',
                            message: 'Official SHA-256 vault verification receipt:',
                            hash: win.verificationHash,
                          })}
                          className="font-mono text-[11px] bg-midnight-navy/5 px-2 py-1 rounded cursor-pointer hover:bg-midnight-navy/10 text-midnight-navy/70"
                        >
                          {win.verificationHash.slice(0, 12)}...
                        </span>
                      </td>
                      <td className="p-4 lg:p-5">
                        {win.isVoided ? (
                          <span className="px-2.5 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-[10px] font-bold uppercase">
                            Voided: {win.voidReason || 'Audited'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                            Official Winner
                          </span>
                        )}
                      </td>
                      <td className="p-4 lg:p-5 text-right">
                        {!win.isVoided && (
                          <button
                            onClick={() => openVoidModal(win)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Void &amp; Redraw
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {winners.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-midnight-navy/50 text-sm">
                        No winners have been drawn yet. Run the live draw from the Live Draw stage.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Winners Card List */}
            <div className="block md:hidden divide-y divide-midnight-navy/10">
              {winners.map(win => (
                <div key={win.id} className={`p-3.5 space-y-2.5 ${win.isVoided ? 'opacity-60 bg-red-50/20' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-gold flex items-center gap-1">
                        <TrophyIcon size={14} />
                        <span>{win.prizeName}</span>
                      </span>
                      <p className="font-mono font-bold text-royal-blue text-sm mt-0.5">{win.ticketNumber}</p>
                    </div>
                    {win.isVoided ? (
                      <span className="px-2 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-[10px] font-bold uppercase">
                        Voided
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                        Winner
                      </span>
                    )}
                  </div>

                  <div className="bg-midnight-navy/[0.02] p-2.5 rounded-lg border border-midnight-navy/5 text-xs space-y-1">
                    <div>
                      <span className="text-midnight-navy/40 font-semibold">Attendee: </span>
                      <span className="font-semibold text-midnight-navy/90">{win.registration.fullName}</span>
                      <span className="text-midnight-navy/50 block text-[11px]">{win.registration.email}</span>
                    </div>
                    <div>
                      <span className="text-midnight-navy/40 font-semibold">Camp: </span>
                      <span className="font-medium text-midnight-navy/80">{win.registration.campName}</span>
                    </div>
                    <div>
                      <span className="text-midnight-navy/40 font-semibold">Drawn: </span>
                      <span className="font-mono text-midnight-navy/70 text-[11px]">{new Date(win.drawnAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {!win.isVoided && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => openVoidModal(win)}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Void &amp; Redraw
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {winners.length === 0 && (
                <div className="p-8 text-center text-midnight-navy/50 text-sm">
                  No winners have been drawn yet.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Registrations Table/List */
          <div className="card overflow-hidden p-0 border border-midnight-navy/10">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-midnight-navy/5 border-b border-midnight-navy/10 text-midnight-navy/50 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 lg:p-5">Name</th>
                    <th className="p-4 lg:p-5">Camp</th>
                    <th className="p-4 lg:p-5">Tickets</th>
                    <th className="p-4 lg:p-5">Method</th>
                    <th className="p-4 lg:p-5">Reference</th>
                    <th className="p-4 lg:p-5">Proof</th>
                    <th className="p-4 lg:p-5">Status</th>
                    <th className="p-4 lg:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-midnight-navy/5">
                  {data?.registrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-midnight-navy/[0.02] transition-colors">
                      <td className="p-4 lg:p-5">
                        <p className="font-semibold text-midnight-navy/90 text-sm">{reg.fullName}</p>
                        <p className="text-xs text-midnight-navy/50">{reg.email}</p>
                      </td>
                      <td className="p-4 lg:p-5 text-sm text-midnight-navy/80">{reg.campName}</td>
                      <td className="p-4 lg:p-5 font-bold text-gold">{reg.ticketCount}</td>
                      <td className="p-4 lg:p-5 text-xs uppercase text-midnight-navy/70 font-medium">{reg.paymentMethod}</td>
                      <td className="p-4 lg:p-5 text-xs font-mono text-midnight-navy/60">{reg.referenceNumber}</td>
                      <td className="p-4 lg:p-5">
                        <button 
                          onClick={() => {
                            const url = reg.proofOfPaymentSignedUrl || reg.proofOfPaymentUrl || reg.proofOfPaymentPath;
                            if (url) {
                              setImageModal(url);
                            } else {
                              setNoticeModal({
                                type: 'info',
                                title: 'Proof Not Available',
                                message: `No proof of payment receipt was attached for ${reg.fullName}.`,
                              });
                            }
                          }}
                          className="text-xs bg-midnight-navy/5 border border-midnight-navy/10 hover:bg-midnight-navy/10 px-3 py-1.5 rounded-lg transition-colors text-midnight-navy/80 font-medium"
                        >
                          View
                        </button>
                      </td>
                      <td className="p-4 lg:p-5">
                        <StatusBadge status={reg.status} />
                      </td>
                      <td className="p-4 lg:p-5 text-right space-x-2">
                        {reg.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => setActionModal({ type: 'approve', id: reg.id, fullName: reg.fullName, ticketCount: reg.ticketCount })} 
                              className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border border-emerald-500/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => setActionModal({ type: 'reject', id: reg.id, fullName: reg.fullName })} 
                              className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 border border-rose-500/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {reg.status === 'approved' && (
                          <button 
                            onClick={() => setActionModal({ type: 'reject', id: reg.id, fullName: reg.fullName })} 
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        )}
                        <button 
                          onClick={() => setActionModal({ type: 'delete', id: reg.id, fullName: reg.fullName, ticketCount: reg.ticketCount })}
                          className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                          title="Permanently delete from database"
                        >
                          <TrashIcon size={13} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data?.registrations.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-midnight-navy/50 text-sm">No registrations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="block md:hidden divide-y divide-midnight-navy/10">
              {data?.registrations.map(reg => (
                <div key={reg.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-midnight-navy/90 text-sm truncate">{reg.fullName}</p>
                      <p className="text-xs text-midnight-navy/50 truncate">{reg.email}</p>
                    </div>
                    <StatusBadge status={reg.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs bg-midnight-navy/[0.02] p-2.5 rounded-lg border border-midnight-navy/5">
                    <div>
                      <span className="text-midnight-navy/40 block text-[10px] uppercase font-semibold">Camp</span>
                      <span className="font-medium text-midnight-navy/80 truncate block">{reg.campName}</span>
                    </div>
                    <div>
                      <span className="text-midnight-navy/40 block text-[10px] uppercase font-semibold">Tickets</span>
                      <span className="font-bold text-gold">{reg.ticketCount}</span>
                    </div>
                    <div>
                      <span className="text-midnight-navy/40 block text-[10px] uppercase font-semibold">Method</span>
                      <span className="font-medium uppercase text-midnight-navy/70">{reg.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-midnight-navy/40 block text-[10px] uppercase font-semibold">Ref #</span>
                      <span className="font-mono text-midnight-navy/60 truncate block">{reg.referenceNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button 
                      onClick={() => {
                        const url = reg.proofOfPaymentSignedUrl || reg.proofOfPaymentUrl || reg.proofOfPaymentPath;
                        if (url) {
                          setImageModal(url);
                        } else {
                          setNoticeModal({
                            type: 'info',
                            title: 'Proof Not Available',
                            message: `No proof of payment receipt was attached for ${reg.fullName}.`,
                          });
                        }
                      }}
                      className="text-xs bg-midnight-navy/5 border border-midnight-navy/10 hover:bg-midnight-navy/10 px-3 py-1.5 rounded-lg transition-colors text-midnight-navy/80 font-medium"
                    >
                      View Proof
                    </button>

                    <div className="flex items-center gap-1.5">
                      {reg.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => setActionModal({ type: 'approve', id: reg.id, fullName: reg.fullName, ticketCount: reg.ticketCount })} 
                            className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => setActionModal({ type: 'reject', id: reg.id, fullName: reg.fullName })} 
                            className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {reg.status === 'approved' && (
                        <button 
                          onClick={() => setActionModal({ type: 'reject', id: reg.id, fullName: reg.fullName })} 
                          className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      <button 
                        onClick={() => setActionModal({ type: 'delete', id: reg.id, fullName: reg.fullName, ticketCount: reg.ticketCount })}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        title="Permanently delete from database"
                      >
                        <TrashIcon size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {data?.registrations.length === 0 && (
                <div className="p-8 text-center text-midnight-navy/50 text-sm">No registrations found.</div>
              )}
            </div>
            
            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="p-3 sm:p-5 border-t border-midnight-navy/5 flex justify-between items-center bg-midnight-navy/[0.01]">
                <span className="text-xs sm:text-sm text-midnight-navy/50">Page {data.page} of {data.totalPages}</span>
                <div className="flex gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-midnight-navy/5 border border-midnight-navy/10 rounded-lg disabled:opacity-30 text-xs sm:text-sm hover:bg-midnight-navy/10 transition-colors"
                  >
                    Prev
                  </button>
                  <button 
                    disabled={page === data.totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-midnight-navy/5 border border-midnight-navy/10 rounded-lg disabled:opacity-30 text-xs sm:text-sm hover:bg-midnight-navy/10 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Image Modal */}
      {imageModal && (
        <div 
          className="fixed inset-0 bg-midnight-navy/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-appear" 
          onClick={() => setImageModal(null)}
        >
          <div 
            className="card bg-white max-w-4xl max-h-[92vh] w-full p-4 sm:p-5 shadow-2xl relative border border-slate-200 flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="font-heading font-bold text-base text-slate-900">
                Proof of Payment Receipt
              </span>
              <div className="flex items-center gap-2">
                <a 
                  href={imageModal} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-royal-blue hover:text-royal-blue-dark bg-royal-blue/10 hover:bg-royal-blue/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <span>Open Full Size ↗</span>
                </a>
                <button 
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold px-2 py-1 leading-none rounded-lg hover:bg-slate-100 transition-colors"
                  onClick={() => setImageModal(null)}
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-center min-h-[250px]">
              <img 
                src={imageModal} 
                alt="Proof of Payment" 
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Void Winner Audit & Redraw Modal */}
      {voidModalWinner && (
        <div 
          className="fixed inset-0 bg-midnight-navy/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-appear"
          onClick={closeVoidModal}
        >
          <div 
            className="card bg-white max-w-lg w-full p-5 sm:p-7 shadow-2xl relative border-2 border-rose-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                  Void Winner &amp; Redraw
                </h3>
              </div>
              <button 
                onClick={closeVoidModal}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Prize Category:</span>
                <span className="font-bold text-gold">{voidModalWinner.prizeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ticket Number:</span>
                <span className="font-mono font-bold text-royal-blue">{voidModalWinner.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Participant Name:</span>
                <span className="font-medium text-slate-800">{voidModalWinner.registration.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Camp:</span>
                <span className="text-slate-700">{voidModalWinner.registration.campName}</span>
              </div>
            </div>

            {voidError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl animate-appear">
                {voidError}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Audit Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={voidReason}
                onChange={e => setVoidReason(e.target.value)}
                placeholder="Specify why this draw is voided (e.g. 'Participant absent during roll call', 'Disqualified per diocese regulations')"
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-royal-blue h-24 resize-none"
                required
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Mandatory for cryptographic audit compliance (min. 5 characters).
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={closeVoidModal}
                disabled={isVoiding}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => executeVoid(false)}
                disabled={isVoiding}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                {isVoiding ? 'Voiding...' : 'Void Only'}
              </button>
              <button
                onClick={() => executeVoid(true)}
                disabled={isVoiding}
                className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 shadow-md transition-all active:scale-95"
              >
                {isVoiding ? 'Voiding...' : 'Void & Redraw Live →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal (Approve / Reject / Delete) - NO reason option for delete */}
      {actionModal && (
        <div 
          className="fixed inset-0 bg-midnight-navy/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-appear"
          onClick={() => !isActionRunning && setActionModal(null)}
        >
          <div 
            className={`card bg-white max-w-md w-full p-5 sm:p-6 shadow-2xl relative border-2 ${
              actionModal.type === 'delete' 
                ? 'border-rose-400' 
                : actionModal.type === 'approve' 
                  ? 'border-emerald-400' 
                  : 'border-amber-400'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-200">
              <span className={`w-3 h-3 rounded-full animate-pulse ${
                actionModal.type === 'delete' ? 'bg-rose-500' : actionModal.type === 'approve' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                {actionModal.type === 'delete' 
                  ? 'Permanently Delete Entry?' 
                  : actionModal.type === 'approve' 
                    ? 'Approve Registration?' 
                    : 'Reject Registration?'}
              </h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Attendee Name:</span>
                <span className="font-semibold text-slate-900">{actionModal.fullName}</span>
              </div>
              {actionModal.ticketCount && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Tickets Count:</span>
                  <span className="font-bold text-gold">{actionModal.ticketCount}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              {actionModal.type === 'delete' && (
                <span className="text-rose-700 font-medium">
                  This action will permanently delete this registration and all associated tickets from the database. This cannot be undone.
                </span>
              )}
              {actionModal.type === 'approve' && (
                <span>
                  This will approve the payment, generate digital tickets in the vault, and send the confirmation email to the attendee.
                </span>
              )}
              {actionModal.type === 'reject' && (
                <span>
                  This will reject the registration and remove any tickets from the active raffle pool.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActionModal(null)}
                disabled={isActionRunning}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeActionModal}
                disabled={isActionRunning}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 ${
                  actionModal.type === 'delete'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : actionModal.type === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isActionRunning 
                  ? 'Processing...' 
                  : actionModal.type === 'delete' 
                    ? 'Yes, Delete Record' 
                    : actionModal.type === 'approve' 
                      ? 'Confirm & Issue Tickets' 
                      : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* General Notice / Error / Cryptographic Hash Modal */}
      {noticeModal && (
        <div 
          className="fixed inset-0 bg-midnight-navy/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-appear"
          onClick={() => setNoticeModal(null)}
        >
          <div 
            className="card bg-white max-w-md w-full p-5 sm:p-6 shadow-2xl relative border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {noticeModal.title}
              </h3>
              <button 
                onClick={() => setNoticeModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              {noticeModal.message}
            </p>

            {noticeModal.hash && (
              <div className="mb-4">
                <div className="bg-slate-900 text-gold p-3 rounded-xl font-mono text-[11px] break-all select-all border border-slate-800">
                  {noticeModal.hash}
                </div>
                <button
                  onClick={() => {
                    if (noticeModal.hash) {
                      navigator.clipboard.writeText(noticeModal.hash);
                      setCopiedHash(true);
                      setTimeout(() => setCopiedHash(false), 2000);
                    }
                  }}
                  className="mt-2 text-xs font-bold text-royal-blue hover:underline inline-flex items-center gap-1"
                >
                  {copiedHash ? '✓ Copied to clipboard!' : 'Copy full hash to clipboard'}
                </button>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setNoticeModal(null)}
                className="btn-primary py-2 px-5 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
