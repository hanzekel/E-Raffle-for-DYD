import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';
import { api } from '../lib/api';
import { RegistrationFormData } from '../types';
import { PlaceholderGcashQR } from '../components/placeholders/PlaceholderGcashQR';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { config, loading } = useConfig();
  const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null);
  const [activeTab, setActiveTab] = useState<'gcash' | 'bank'>('gcash');
  
  const [referenceNumber, setReferenceNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  useEffect(() => {
    const data = sessionStorage.getItem('dyd26_registration');
    if (data) {
      setRegistrationData(JSON.parse(data));
    } else {
      navigate('/register');
    }
  }, [navigate]);

  if (loading || !config || !registrationData) return <LoadingSpinner message="Preparing payment..." />;

  const totalAmount = registrationData.ticketCount * config.ticketPrice;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.match(/^[a-zA-Z0-9]{8,30}$/)) {
      alert('Invalid reference number (8-30 alphanumeric characters)');
      return;
    }
    if (!file) {
      alert('Please upload proof of payment');
      return;
    }

    setIsSubmitting(true);
    try {
      setProgressMsg('Getting upload URL...');
      const uploadRes = await api.post<{ uploadUrl: string; filePath: string }>('/upload-url', {
        contentType: file.type,
        fileSize: file.size,
      });

      if (!uploadRes.success || !uploadRes.data) throw new Error('Failed to get upload URL');

      setProgressMsg('Uploading image...');
      const uploaded = await api.uploadDirect(uploadRes.data.uploadUrl, file);
      if (!uploaded) throw new Error('Image upload failed');

      setProgressMsg('Submitting registration...');
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
        throw new Error(finalRes.error || 'Submission failed');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-3xl animate-appear relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-midnight-navy/10 backdrop-blur-md z-50 flex items-center justify-center rounded-3xl">
          <LoadingSpinner message={progressMsg} />
        </div>
      )}

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-midnight-navy/10 bg-midnight-navy/5 backdrop-blur-md mx-auto">
          <span className="text-sm font-medium text-midnight-navy/80">Step 2 of 2</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-semibold gradient-text mb-4 text-balance">Payment</h1>
        <p className="text-midnight-navy/60">Complete your registration</p>
      </div>
      
      <div className="card mb-8">
        <h2 className="text-lg font-medium mb-4 border-b border-midnight-navy/5 pb-4 text-midnight-navy/80">Payment Summary</h2>
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
            className={`flex-1 py-3 text-center text-sm font-semibold rounded-lg transition-all ${activeTab === 'gcash' ? 'bg-midnight-navy/10 text-gold shadow-sm' : 'text-midnight-navy/50 hover:text-midnight-navy/80'}`}
            onClick={() => setActiveTab('gcash')}
          >
            GCash
          </button>
          <button 
            className={`flex-1 py-3 text-center text-sm font-semibold rounded-lg transition-all ${activeTab === 'bank' ? 'bg-midnight-navy/10 text-gold shadow-sm' : 'text-midnight-navy/50 hover:text-midnight-navy/80'}`}
            onClick={() => setActiveTab('bank')}
          >
            Bank Transfer
          </button>
        </div>

        {activeTab === 'gcash' && (
          <div className="animate-appear-zoom mb-8 text-center">
            <PlaceholderGcashQR />
            <div className="bg-midnight-navy/[0.02] border border-midnight-navy/[0.05] p-6 rounded-xl inline-block mt-6">
              <p className="text-sm text-midnight-navy/50 mb-2">Send payment to GCash:</p>
              <p className="font-semibold text-2xl tracking-wider text-midnight-navy/90 mb-1">{config.gcashNumber}</p>
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
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Reference Number</label>
            <input 
              type="text" 
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="input-field uppercase" 
              placeholder="e.g. 100239482736"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-midnight-navy/70">Proof of Payment</label>
            <div className="relative">
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="w-full text-sm text-midnight-navy/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-midnight-navy/10 file:text-midnight-navy hover:file:bg-midnight-navy/20 transition-all cursor-pointer bg-midnight-navy/[0.03] rounded-xl border border-dashed border-midnight-navy/20 hover:border-midnight-navy/40"
                required
              />
            </div>
            {preview && (
              <div className="mt-6 flex justify-center animate-appear-zoom p-2 bg-midnight-navy/5 rounded-xl border border-midnight-navy/10 inline-block">
                <img src={preview} alt="Proof preview" className="max-h-56 rounded-lg" />
              </div>
            )}
          </div>

          <button type="submit" className="w-full btn-primary py-4 text-lg mt-8 shadow-[0_4px_20px_rgba(245,166,35,0.2)]">
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};
