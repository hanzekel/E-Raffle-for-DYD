import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { AdminDashboardData } from '../types';
import { PlaceholderLogo } from '../components/placeholders/PlaceholderLogo';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';

type TabStatus = 'all' | 'pending' | 'approved' | 'rejected';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [imageModal, setImageModal] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    const statusParam = activeTab !== 'all' ? `&status=${activeTab}` : '';
    const res = await api.get<AdminDashboardData>(`/admin/dashboard?page=${page}&limit=10&search=${search}${statusParam}`);
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  }, [activeTab, search, page]);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/admin/login');
    } else if (isAuthenticated === true) {
      fetchDashboard();
    }
  }, [isAuthenticated, fetchDashboard, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this registration?')) return;
    const res = await api.post(`/admin/approve/${id}`, {});
    if (res.success) {
      fetchDashboard();
    } else {
      alert(res.error || 'Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    const note = prompt('Optional rejection note (reason):');
    if (note === null) return; // Cancelled
    const res = await api.post(`/admin/reject/${id}`, { rejectionNote: note });
    if (res.success) {
      fetchDashboard();
    } else {
      alert(res.error || 'Failed to reject');
    }
  };

  if (isAuthenticated === null || loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-midnight-navy/10 backdrop-blur-xl border-b border-midnight-navy/5 p-4 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <PlaceholderLogo size={40} />
          <span className="font-heading font-semibold text-xl text-midnight-navy hidden md:inline tracking-wide">DYD26 Admin</span>
        </div>
        <button onClick={handleLogout} className="btn-secondary py-2 px-4 text-sm bg-midnight-navy/5 hover:bg-midnight-navy/10">
          Logout
        </button>
      </header>

      <main className="flex-grow p-4 md:p-8 container mx-auto max-w-7xl animate-appear">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="card border-l-4 border-l-royal-blue/80">
            <p className="text-midnight-navy/50 text-sm font-medium mb-1">Total</p>
            <p className="text-4xl font-semibold text-midnight-navy/90">{data?.total || 0}</p>
          </div>
          <div className="card border-l-4 border-l-yellow-500/80">
            <p className="text-midnight-navy/50 text-sm font-medium mb-1">Pending</p>
            <p className="text-4xl font-semibold text-yellow-500/90">...</p>
          </div>
          <div className="card border-l-4 border-l-green-500/80">
            <p className="text-midnight-navy/50 text-sm font-medium mb-1">Approved</p>
            <p className="text-4xl font-semibold text-green-500/90">...</p>
          </div>
          <div className="card border-l-4 border-l-red-500/80">
            <p className="text-midnight-navy/50 text-sm font-medium mb-1">Rejected</p>
            <p className="text-4xl font-semibold text-red-500/90">...</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex bg-midnight-navy/5 rounded-xl p-1 border border-midnight-navy/10 w-full md:w-auto">
            {['all', 'pending', 'approved', 'rejected'].map(tab => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab as TabStatus); setPage(1); }}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-midnight-navy/10 text-gold shadow-sm' : 'text-midnight-navy/50 hover:text-midnight-navy/80'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search by name or reference..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchDashboard()}
              className="input-field w-full md:w-80 bg-midnight-navy/5 border-midnight-navy/10"
            />
          </div>
        </div>

        {/* Table/List */}
        <div className="card overflow-hidden p-0 border border-midnight-navy/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-midnight-navy/5 border-b border-midnight-navy/10 text-midnight-navy/50 text-sm uppercase tracking-wider font-medium">
                  <th className="p-5">Name</th>
                  <th className="p-5">Camp</th>
                  <th className="p-5">Tickets</th>
                  <th className="p-5">Method</th>
                  <th className="p-5">Reference</th>
                  <th className="p-5">Proof</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {data?.registrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-midnight-navy/[0.02] transition-colors group">
                    <td className="p-5">
                      <p className="font-semibold text-midnight-navy/90">{reg.fullName}</p>
                      <p className="text-xs text-midnight-navy/50 mt-1">{reg.email}</p>
                    </td>
                    <td className="p-5 text-sm text-midnight-navy/80">{reg.campName}</td>
                    <td className="p-5 font-semibold text-gold">{reg.ticketCount}</td>
                    <td className="p-5 text-sm uppercase text-midnight-navy/70">{reg.paymentMethod}</td>
                    <td className="p-5 text-sm font-mono text-midnight-navy/60">{reg.referenceNumber}</td>
                    <td className="p-5">
                      <button 
                        onClick={() => setImageModal(reg.proofOfPaymentPath)}
                        className="text-xs bg-midnight-navy/5 border border-midnight-navy/10 hover:bg-midnight-navy/10 px-4 py-2 rounded-lg transition-colors text-midnight-navy/80"
                      >
                        View
                      </button>
                    </td>
                    <td className="p-5">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="p-5 text-right space-x-2">
                      {reg.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(reg.id)} className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleReject(reg.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {data?.registrations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-midnight-navy/50 text-lg">No registrations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="p-5 border-t border-midnight-navy/5 flex justify-between items-center bg-midnight-navy/[0.01]">
              <span className="text-sm text-midnight-navy/50">Page {data.page} of {data.totalPages}</span>
              <div className="flex gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 bg-midnight-navy/5 border border-midnight-navy/10 rounded-lg disabled:opacity-30 text-sm hover:bg-midnight-navy/10 transition-colors"
                >
                  Prev
                </button>
                <button 
                  disabled={page === data.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 bg-midnight-navy/5 border border-midnight-navy/10 rounded-lg disabled:opacity-30 text-sm hover:bg-midnight-navy/10 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {imageModal && (
        <div className="fixed inset-0 bg-midnight-navy/10 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-appear" onClick={() => setImageModal(null)}>
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-midnight-navy/10 shadow-2xl bg-[#F8FAFC]" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 bg-midnight-navy/10 hover:bg-midnight-navy/10 text-midnight-navy w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-midnight-navy/10 backdrop-blur"
              onClick={() => setImageModal(null)}
            >
              &times;
            </button>
            <img src={imageModal} alt="Proof of Payment" className="max-w-full max-h-[90vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
