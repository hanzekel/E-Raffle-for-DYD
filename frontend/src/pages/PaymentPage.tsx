import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';
import { api } from '../lib/api';
import { RegistrationFormData } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { GcashQR } from '../components/GcashQR';
import { AlertTriangleIcon, CheckIcon } from '../components/icons/Icons';
import { validateReceiptImage } from '../lib/receiptValidator';

export const PaymentPage: React.FC = () => {
  const { config, loading } = useConfig();
  const navigate = useNavigate();

  const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null);
  const [activeTab, setActiveTab] = useState<'gcash' | 'bank'>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  const [isReceiptVerified, setIsReceiptVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const data = sessionStorage.getItem('dyd26_registration');
    if (data) {
      setRegistrationData(JSON.parse(data));
    } else {
      navigate('/register');
    }
  }, [navigate]);

  if (!registrationData) return <LoadingSpinner message="Preparing payment..." />;
  if (loading && !config) return <LoadingSpinner message="Loading payment details..." />;

  const totalAmount = registrationData.ticketCount * config.ticketPrice;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError('');
    setIsReceiptVerified(false);
    const selected = e.target.files?.[0];

    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }

    setIsValidatingImage(true);
    try {
      // Analyze file health, blank canvas variance, and receipt text structure
      const validation = await validateReceiptImage(selected);

      if (!validation.isValid) {
        setFormError(validation.error || 'Invalid proof of payment image.');
        setFile(null);
        setPreview(null);
        setIsReceiptVerified(false);
        e.target.value = '';
        return;
      }

      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
      setIsReceiptVerified(true);
    } catch {
      setFormError('Failed to inspect uploaded file. Please choose a valid screenshot.');
      setFile(null);
      setPreview(null);
      setIsReceiptVerified(false);
      e.target.value = '';
    } finally {
      setIsValidatingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!referenceNumber.match(/^[a-zA-Z0-9]{8,30}$/)) {
      setFormError('Please enter a valid reference number (8 to 30 letters or numbers).');
      return;
    }
    if (!file) {
      setFormError('Please attach a valid transaction proof before submitting.');
      return;
    }

    // Re-verify receipt structure to prevent spoofing
    const recheck = await validateReceiptImage(file);
    if (!recheck.isValid) {
      setFormError(recheck.error || 'The uploaded file does not pass transaction receipt verification.');
      return;
    }

    setIsSubmitting(true);
    try {
      setProgressMsg('Connecting to secure upload storage...');
      const uploadRes = await api.post<{ uploadUrl: string; filePath: string }>('/upload-url', {
        contentType: file.type,
        fileSize: file.size,
      });

      if (!uploadRes.success || !uploadRes.data) {
        throw new Error(uploadRes.error || 'Unable to prepare secure upload link. Please try again.');
      }

      setProgressMsg('Uploading your proof of payment...');
      const uploaded = await api.uploadDirect(uploadRes.data.uploadUrl, file);
      if (!uploaded) {
        throw new Error('Image upload interrupted. Please check your connection and try again.');
      }

      setProgressMsg('Securing your tickets...');
      const finalRes = await api.post<{ registrationId: string }>('/payment', {
        ...registrationData,
        paymentMethod: activeTab,
        referenceNumber,
        proofOfPaymentPath: uploadRes.data.filePath,
      });

      if (finalRes.success && finalRes.data) {
        sessionStorage.removeItem('dyd26_registration');
        navigate(`/confirmation?id=${finalRes.data.registrationId}`);
      } else {
        throw new Error(finalRes.error || 'Submission could not be completed. Please check your reference number.');
      }
    } catch (err: any) {
      setFormError(err.message || 'We ran into an issue while submitting. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-2xl animate-appear relative">
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-xl z-[100] flex items-center justify-center">
          <LoadingSpinner message={progressMsg} />
        </div>
      )}

      <div className="text-center mb-5 sm:mb-6">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-midnight-navy/10 bg-midnight-navy/5 backdrop-blur-md mx-auto">
          <span className="text-sm font-medium text-midnight-navy/80">Step 2 of 2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold gradient-text leading-tight sm:leading-snug mb-1 sm:mb-2 py-1">
          Payment Details
        </h1>
        <p className="text-midnight-navy/60">Complete your registration to secure your e-tickets</p>
      </div>
      
      <div className="card mb-5">
        <h2 className="text-lg font-medium mb-4 border-b border-midnight-navy/5 pb-4 text-midnight-navy/80">
          Payment Summary
        </h2>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-midnight-navy/90 font-medium text-lg">{registrationData.fullName}</p>
            <p className="text-sm text-midnight-navy/50 mt-1">{registrationData.ticketCount} Ticket(s)</p>
          </div>
          <div className="bg-midnight-navy/5 px-6 py-3 rounded-xl border border-midnight-navy/10">
            <p className="font-semibold text-gold text-2xl">₱{totalAmount}</p>
          </div>
        </div>
      </div>

      <div className="card">
        {/* Tab Segment Control */}
        <div className="flex p-1 mb-8 bg-midnight-navy/5 rounded-xl border border-midnight-navy/10">
          <button 
            type="button"
            className={`flex-1 py-3 text-center text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'gcash'
                ? 'bg-midnight-navy/10 text-gold shadow-sm font-bold'
                : 'text-midnight-navy/50 hover:text-midnight-navy/80'
            }`}
            onClick={() => setActiveTab('gcash')}
          >
            GCash
          </button>
          <button 
            type="button"
            className={`flex-1 py-3 text-center text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'bank'
                ? 'bg-midnight-navy/10 text-gold shadow-sm font-bold'
                : 'text-midnight-navy/50 hover:text-midnight-navy/80'
            }`}
            onClick={() => setActiveTab('bank')}
          >
            Bank Transfer
          </button>
        </div>

        {activeTab === 'gcash' && (
          <div className="animate-appear-zoom mb-8 text-center">
            <GcashQR />
            <div className="bg-midnight-navy/[0.02] border border-midnight-navy/[0.05] p-6 rounded-xl inline-block mt-6">
              <p className="text-sm text-midnight-navy/50 mb-2">Send payment to GCash:</p>
              <p className="font-semibold text-2xl tracking-wider text-midnight-navy/90 mb-1">
                {config.gcashNumber}
              </p>
              <p className="text-midnight-navy/60">{config.gcashName}</p>
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="animate-appear-zoom mb-8">
            <div className="bg-midnight-navy/[0.02] p-8 rounded-xl border border-midnight-navy/[0.05] text-center max-w-md mx-auto">
              <p className="text-sm text-midnight-navy/50 mb-1">Bank Name</p>
              <p className="font-semibold text-xl mb-6 text-midnight-navy/90">{config.bankName}</p>
              
              <p className="text-sm text-midnight-navy/50 mb-1">Account Number</p>
              <p className="font-semibold text-2xl mb-6 tracking-widest text-gold">{config.bankAccountNumber}</p>
              
              <p className="text-sm text-midnight-navy/50 mb-1">Account Name</p>
              <p className="font-medium text-lg text-midnight-navy/80">{config.bankAccountName}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 border-t border-midnight-navy/5 pt-8">
          <div>
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">
              Reference Number
            </label>
            <input 
              type="text" 
              value={referenceNumber}
              onChange={(e) => {
                setReferenceNumber(e.target.value);
                setFormError('');
              }}
              className="input-field uppercase" 
              placeholder="e.g. 100239482736"
              required 
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Found on your GCash or Bank receipt (8 to 30 characters).
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-midnight-navy/70">
                Proof of Payment
              </label>
              {isValidatingImage && (
                <span className="text-xs text-royal-blue font-semibold animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-royal-blue animate-ping" />
                  <span>Inspecting receipt structure...</span>
                </span>
              )}
            </div>
            <div className="relative">
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={isValidatingImage || isSubmitting}
                className="w-full text-sm text-midnight-navy/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-midnight-navy/10 file:text-midnight-navy hover:file:bg-midnight-navy/20 transition-all cursor-pointer bg-midnight-navy/[0.03] rounded-xl border border-dashed border-midnight-navy/20 hover:border-midnight-navy/40 disabled:opacity-50"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Attach an official screenshot of your GCash, Maya, or Bank confirmation slip. Blank or non-transaction images will not be accepted.
            </p>

            {preview && isReceiptVerified && (
              <div className="mt-4 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 animate-appear-zoom flex flex-col sm:flex-row items-center gap-3">
                <img src={preview} alt="Proof preview" className="max-h-36 max-w-[120px] rounded-lg shadow-sm border border-emerald-200 object-cover" />
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                    <CheckIcon size={16} className="text-emerald-600" />
                    <span>Transaction Receipt Verified</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                    Legible document layout and high-contrast text detected. Ready for submission.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Humanized Error Banner */}
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 animate-appear">
              <AlertTriangleIcon size={18} className="text-red-600 shrink-0 mt-0.5" />
              <div className="flex-grow font-medium leading-relaxed">{formError}</div>
              <button
                type="button"
                onClick={() => setFormError('')}
                className="text-red-400 hover:text-red-600 font-bold text-base leading-none px-1"
                aria-label="Close error notice"
              >
                &times;
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg mt-8 shadow-[0_4px_20px_rgba(245,166,35,0.2)]"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};
