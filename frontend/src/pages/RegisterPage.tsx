import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';
import { registrationSchema, validateField } from '../lib/validation';
import { sanitizeFormData } from '../lib/sanitize';
import { RegistrationFormData } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { api } from '../lib/api';

export const RegisterPage: React.FC = () => {
  const { config, loading } = useConfig();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    contactNumber: '',
    campName: '',
    ticketCount: 1,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});
  const [customCamp, setCustomCamp] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading || !config) return <LoadingSpinner message="Loading registration form..." />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue: any = value;
    
    if (name === 'ticketCount') {
      finalValue = parseInt(value, 10) || 1;
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    const err = validateField(registrationSchema, name, finalValue);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleCustomCampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCamp(e.target.value);
    setFormData(prev => ({ ...prev, campName: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitized = sanitizeFormData(formData);
    const result = registrationSchema.safeParse(sanitized);
    
    if (!result.success) {
      const newErrors: any = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/register', sanitized);
      if (res.success) {
        setFormData(sanitized);
        setShowSummary(true);
      } else {
        alert(res.error || 'Registration failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const proceedToPayment = () => {
    sessionStorage.setItem('dyd26_registration', JSON.stringify(formData));
    navigate('/payment');
  };

  const totalAmount = formData.ticketCount * config.ticketPrice;
  const isOtherCamp = formData.campName !== '' && !config.campNames.includes(formData.campName);

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-2xl animate-appear">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-midnight-navy/10 bg-midnight-navy/5 backdrop-blur-md mx-auto">
          <span className="text-sm font-medium text-midnight-navy/80">Step 1 of 2</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-semibold gradient-text mb-4 text-balance">Raffle Registration</h1>
        <p className="text-midnight-navy/60">Secure your tickets for the DYD 2026</p>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" placeholder="Juan Dela Cruz" />
            {errors.fullName && <p className="text-highlight-red text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="juan@example.com" />
            {errors.email && <p className="text-highlight-red text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Contact Number</label>
            <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="input-field" placeholder="09XXXXXXXXX" maxLength={11} />
            {errors.contactNumber && <p className="text-highlight-red text-sm mt-1">{errors.contactNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Camp Name</label>
            <select 
              name="campName" 
              value={isOtherCamp ? 'Other' : formData.campName} 
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setFormData(prev => ({ ...prev, campName: customCamp }));
                } else {
                  handleChange(e);
                }
              }} 
              className="input-field bg-midnight-navy/10"
            >
              <option value="">Select Camp</option>
              {config.campNames.map(camp => (
                <option key={camp} value={camp}>{camp}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {isOtherCamp && (
              <input 
                type="text" 
                value={customCamp} 
                onChange={handleCustomCampChange} 
                className="input-field mt-3 animate-appear-zoom" 
                placeholder="Enter Camp Name" 
              />
            )}
            {errors.campName && <p className="text-highlight-red text-sm mt-1">{errors.campName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Number of Tickets</label>
            <input type="number" name="ticketCount" value={formData.ticketCount} onChange={handleChange} min={1} max={config.maxTickets} className="input-field" />
            {errors.ticketCount && <p className="text-highlight-red text-sm mt-1">{errors.ticketCount}</p>}
          </div>

          <div className="bg-midnight-navy/[0.03] p-6 rounded-xl border border-midnight-navy/[0.08] mt-8 flex flex-col sm:flex-row justify-between items-center">
            <span className="text-midnight-navy/60 mb-2 sm:mb-0">Total Price</span>
            <div className="text-right">
              <span className="text-sm text-midnight-navy/50 mr-2">₱{config.ticketPrice} × {formData.ticketCount} =</span>
              <span className="font-semibold text-gold text-2xl">₱{totalAmount}</span>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary text-lg mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Validating...' : 'Review Registration'}
          </button>
        </form>
      </div>

      {showSummary && (
        <div className="fixed inset-0 bg-midnight-navy/10 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-appear">
          <div className="card max-w-md w-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-radial-gradient from-gold/10 to-transparent opacity-50 blur-3xl pointer-events-none"></div>
            
            <h2 className="text-2xl font-semibold mb-6 text-center text-midnight-navy border-b border-midnight-navy/5 pb-4">Order Summary</h2>
            <div className="space-y-4 mb-8 relative z-10">
              <div className="flex justify-between border-b border-midnight-navy/5 pb-3">
                <span className="text-midnight-navy/50">Name</span>
                <span className="font-medium text-midnight-navy/90 text-right">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-midnight-navy/5 pb-3">
                <span className="text-midnight-navy/50">Email</span>
                <span className="font-medium text-midnight-navy/90 text-right">{formData.email}</span>
              </div>
              <div className="flex justify-between border-b border-midnight-navy/5 pb-3">
                <span className="text-midnight-navy/50">Camp</span>
                <span className="font-medium text-midnight-navy/90 text-right">{formData.campName}</span>
              </div>
              <div className="flex justify-between border-b border-midnight-navy/5 pb-3">
                <span className="text-midnight-navy/50">Tickets</span>
                <span className="font-medium text-midnight-navy/90 text-right">{formData.ticketCount}</span>
              </div>
              <div className="flex justify-between bg-midnight-navy/5 p-4 rounded-xl border border-midnight-navy/10">
                <span className="font-medium text-midnight-navy/80">Total Amount</span>
                <span className="font-semibold text-gold text-xl">₱{totalAmount}</span>
              </div>
            </div>
            <div className="flex gap-4 relative z-10">
              <button onClick={() => setShowSummary(false)} className="flex-1 btn-secondary">Edit</button>
              <button onClick={proceedToPayment} className="flex-1 btn-primary">Proceed to Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
