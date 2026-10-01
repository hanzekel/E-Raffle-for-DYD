import React from 'react';

interface Props {
  status: 'pending' | 'approved' | 'rejected';
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};
