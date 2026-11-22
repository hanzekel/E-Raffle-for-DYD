// frontend/src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';
import { registrationSchema, validateField } from '../lib/validation';
import { sanitizeFormData } from '../lib/sanitize';
import { RegistrationFormData } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { api } from '../lib/api';

export const RegisterPage: React.FC = () => {
  const { config, loading } = useConfig();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillName = searchParams.get('name') || '';
  const prefillCamp = searchParams.get('camp') || '';

  const presetCamps = config.campNames.filter((c) => c !== 'Other');
  const isPrefillCustom = prefillCamp !== '' && !presetCamps.includes(prefillCamp);

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: prefillName,
    email: '',
    contactNumber: '',
    campName: prefillCamp,
    ticketCount: 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});
  const [ticketInput, setTicketInput] = useState('1');
  const [customCamp, setCustomCamp] = useState(isPrefillCustom ? prefillCamp : '');
  const [isOtherSelected, setIsOtherSelected] = useState(isPrefillCustom);
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Config is guaranteed via fallback, no freeze
  if (loading && !config) return <LoadingSpinner message="Loading registration form..." />;

  const maxTickets = config.maxTickets || 10;

  // Keeps stepper buttons, quick pills, and numeric text box synchronized
  const setTicketQuantity = (qty: number) => {
    const clamped = Math.max(1, Math.min(maxTickets, qty));
    setTicketInput(String(clamped));
    setFormData(prev => ({ ...prev, ticketCount: clamped }));
    const err = validateField(registrationSchema, 'ticketCount', clamped);
    setErrors(prev => ({ ...prev, ticketCount: err || undefined }));
  };

  const handleTicketTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setTicketInput(digitsOnly);

    if (digitsOnly === '') {
      setFormData(prev => ({ ...prev, ticketCount: 0 }));
      setErrors(prev => ({ ...prev, ticketCount: 'Enter between 1 and ' + maxTickets + ' tickets' }));
      return;
    }

    const parsed = parseInt(digitsOnly, 10);
    setFormData(prev => ({ ...prev, ticketCount: parsed }));
    const err = validateField(registrationSchema, 'ticketCount', parsed);
    setErrors(prev => ({ ...prev, ticketCount: err || undefined }));
  };

  const handleTicketBlur = () => {
    if (ticketInput === '') {
      setTicketQuantity(1);
    } else {
      const parsed = parseInt(ticketInput, 10);
      if (!Number.isNaN(parsed)) {
        setTicketQuantity(parsed);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const err = validateField(registrationSchema, name, value);
    setErrors(prev => ({ ...prev, [name]: err || undefined }));
  };

  const handleCustomCampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomCamp(val);
    setFormData(prev => ({ ...prev, campName: val }));
    const err = validateField(registrationSchema, 'campName', val);
    setErrors(prev => ({ ...prev, campName: err || undefined }));
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

    setSubmitError('');
    setIsSubmitting(true);
    try {
      const res = await api.post('/register', sanitized);
      if (res.success) {
        setFormData(sanitized);
        setShowSummary(true);
      } else {
        setSubmitError(res.error || 'Something did not look right—please check your details.');
      }
    } catch {
      setSubmitError('Having trouble connecting right now. Check your internet and try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const proceedToPayment = () => {
    sessionStorage.setItem('dyd26_registration', JSON.stringify(formData));
    navigate('/payment');
  };

  const totalAmount = formData.ticketCount * config.ticketPrice;
  const isOtherCamp = isOtherSelected || (formData.campName !== '' && !presetCamps.includes(formData.campName));

  return (
    <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-xl animate-appear">
      <div className="text-center mb-5 sm:mb-6">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-midnight-navy/10 bg-midnight-navy/5 backdrop-blur-md mx-auto">
          <span className="text-sm font-medium text-midnight-navy/80">Step 1 of 2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold gradient-text leading-tight sm:leading-snug mb-1 sm:mb-2 py-1">Raffle Registration</h1>
        <p className="text-midnight-navy/60">Grab your tickets for DYD 2026</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  setIsOtherSelected(true);
                  setFormData(prev => ({ ...prev, campName: customCamp }));
                } else {
                  setIsOtherSelected(false);
                  handleChange(e);
                }
              }}
              className="input-field bg-midnight-navy/10"
            >
              <option value="">Select Camp</option>
              {presetCamps.map(camp => (
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
                placeholder="Enter your Parish or Camp Name"
              />
            )}
            {errors.campName && <p className="text-highlight-red text-sm mt-1">{errors.campName}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="ticketCountInput" className="block text-sm font-medium text-midnight-navy/70">
                Number of Tickets
              </label>
              <span className="text-[11px] font-medium text-midnight-navy/50">
                Max {maxTickets} per order
              </span>
            </div>

            {/* Touch-friendly stepper for phones & tablets alongside numeric input */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTicketQuantity(formData.ticketCount - 1)}
                disabled={formData.ticketCount <= 1}
                aria-label="Decrease ticket quantity"
                className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white text-midnight-navy font-bold text-lg shadow-sm hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                &minus;
              </button>
              <input
                id="ticketCountInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="ticketCount"
                value={ticketInput}
                onChange={handleTicketTextChange}
                onBlur={handleTicketBlur}
                aria-label="Number of tickets"
                className="input-field text-center font-bold text-base min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setTicketQuantity(formData.ticketCount + 1)}
                disabled={formData.ticketCount >= maxTickets}
                aria-label="Increase ticket quantity"
                className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white text-midnight-navy font-bold text-lg shadow-sm hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* 1-tap quick-select pills for mobile & tablet */}
            <div className="flex flex-wrap gap-1.5 mt-2.5" role="group" aria-label="Quick ticket quantity options">
              {[1, 2, 3, 5, 10]
                .filter((qty) => qty <= maxTickets)
                .map((qty) => {
                  const selected = formData.ticketCount === qty && ticketInput !== '';
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setTicketQuantity(qty)}
                      aria-pressed={selected}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                        selected
                          ? 'bg-royal-blue text-white border-royal-blue shadow-sm'
                          : 'bg-slate-50 text-midnight-navy/75 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {qty} {qty === 1 ? 'Ticket' : 'Tickets'}
                    </button>
                  );
                })}
            </div>
            {errors.ticketCount && <p className="text-highlight-red text-sm mt-1.5">{errors.ticketCount}</p>}
          </div>

          <div className="bg-midnight-navy/[0.03] p-6 rounded-xl border border-midnight-navy/[0.08] mt-8 flex flex-col sm:flex-row justify-between items-center">
            <span className="text-midnight-navy/60 mb-2 sm:mb-0">Total Price</span>
            <div className="text-right">
              <span className="text-sm text-midnight-navy/50 mr-2">₱{config.ticketPrice} × {formData.ticketCount} =</span>
              <span className="font-semibold text-gold text-2xl">₱{totalAmount}</span>
            </div>
          </div>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm text-center animate-appear">
              {submitError}
            </div>
          )}

          <button type="submit" className="w-full btn-primary text-lg mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Checking details...' : 'Review Registration'}
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
