// Status indicator badge
import React from 'react';

interface Props {
  status: 'pending' | 'approved' | 'rejected';
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    rejected: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  };

  return (
    <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};
