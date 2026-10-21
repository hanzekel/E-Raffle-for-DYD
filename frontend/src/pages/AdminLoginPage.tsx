import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]/40 p-3 sm:p-4 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-gold/10 to-transparent opacity-50 blur-3xl pointer-events-none"></div>
      
      <div className="card w-full max-w-sm sm:max-w-md p-5 sm:p-8 relative z-10 animate-appear">
        <div className="text-center mb-4 sm:mb-8">
          <Logo size={46} className="mx-auto mb-3 sm:mb-6" />
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold gradient-text mb-1 sm:mb-2">Admin Portal</h1>
          <p className="text-midnight-navy/50 text-sm">Sign in to manage registrations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="input-field" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="input-field" 
              required 
            />
          </div>

          {error && <p className="text-highlight-red text-sm text-center">{error}</p>}

          <button type="submit" className="w-full btn-primary py-2.5 sm:py-3 text-base sm:text-lg mt-2 sm:mt-4" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
