// frontend/src/components/RaffleGuideSection.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TicketIcon,
  CheckIcon,
  SparklesIcon,
  CelebrationIcon,
} from './icons/Icons';

interface RaffleGuideSectionProps {
  ticketPrice: number;
  maxTickets: number;
  gcashNumber: string;
  gcashName: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const STEPS = [
  {
    step: '01',
    title: 'Register Your Details',
    icon: TicketIcon,
    accent: 'bg-royal-blue/10 text-royal-blue border-royal-blue/15',
  },
  {
    step: '02',
    title: 'Send Payment via GCash',
    icon: SparklesIcon,
    accent: 'bg-[#C81D25]/10 text-[#C81D25] border-[#C81D25]/15',
  },
  {
    step: '03',
    title: 'Receive Official E-Tickets',
    icon: CheckIcon,
    accent: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  },
  {
    step: '04',
    title: 'Watch the Live Draw',
    icon: CelebrationIcon,
    accent: 'bg-gold/15 text-gold-dark border-gold/30',
  },
] as const;

export const RaffleGuideSection: React.FC<RaffleGuideSectionProps> = ({
  ticketPrice,
  maxTickets,
  gcashNumber,
  gcashName,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('cost');

  const stepDescriptions: Record<string, string> = {
    '01': `Go to Register, enter your full name, email, 09-prefixed mobile number, select your camp, and choose 1 to ${maxTickets} tickets (₱${ticketPrice} each).`,
    '02': `Scan our GCash QR or send directly to ${gcashNumber} (${gcashName}), enter your GCash Reference Number, and upload a clear receipt screenshot.`,
    '03': 'Our admin team verifies your receipt. Once approved, your official PDF tickets with unique QR codes are emailed straight to you.',
    '04': 'Tune in on December 11, 2026 at 1:30 PM or open the Live Draw page to watch winning ticket numbers drawn live on stage!',
  };

  const faqs: FaqItem[] = [
    {
      id: 'cost',
      question: `How much is a raffle ticket and how many can I buy?`,
      answer: `Each raffle e-ticket is ₱${ticketPrice}. You can get between 1 and ${maxTickets} tickets per registration—more tickets mean more entries and higher chances of winning.`,
    },
    {
      id: 'payment',
      question: 'What payment method is accepted?',
      answer: `We currently accept GCash payments only. You can scan the official GCash QR code on the payment page or send directly to ${gcashNumber} (${gcashName}), then upload your receipt screenshot and reference number.`,
    },
    {
      id: 'receive',
      question: 'How and when will I get my official tickets?',
      answer: 'Right after submitting payment, you will receive a confirmation email with your Ticket Code. Once our team verifies your GCash receipt, your official PDF tickets (each with its own unique ticket number and QR code) will arrive via email.',
    },
    {
      id: 'status',
      question: 'How can I check my ticket status or download my PDFs again?',
      answer: 'Click "Check My Tickets" (or Tickets in the top menu), enter your Order ID / Ticket Code and registered email address, and we will send a secure link straight to your inbox to view your status and download your PDFs.',
    },
    {
      id: 'draw',
      question: 'When is the live raffle draw?',
      answer: 'The Grand Draw takes place on December 11, 2026 at 1:30 PM. Every approved ticket enters the same draw pool equally, and winners are drawn live on stage.',
    },
    {
      id: 'camp',
      question: 'What if my camp or parish is not in the dropdown list?',
      answer: 'Simply choose "Other" in the Camp dropdown on the registration page and type your exact camp or parish delegation name.',
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
      {/* How to Join / Instructions */}
      <section aria-labelledby="how-to-join-heading" className="rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200 p-4 sm:p-6 md:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-royal-blue bg-royal-blue/10 px-3 py-1 rounded-full mb-2">
              <span>Step-by-Step Guide</span>
            </span>
            <h2 id="how-to-join-heading" className="font-heading font-black text-xl sm:text-2xl gradient-text leading-tight py-1">
              How to Join the DYD 2026 Raffle
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Quick online registration and GCash checkout in four easy steps.
            </p>
          </div>
          <Link
            to="/register"
            aria-label="Start raffle registration now"
            className="btn-festive-red text-center self-start sm:self-center whitespace-nowrap"
          >
            Register Now &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STEPS.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 flex flex-col justify-between hover:border-royal-blue/30 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.accent}`}>
                      <IconComp size={18} />
                    </span>
                    <span className="font-mono font-black text-sm text-slate-400">
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stepDescriptions[item.step]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section aria-labelledby="faq-heading" className="rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200 p-4 sm:p-6 md:p-7 shadow-sm">
        <div className="pb-4 mb-5 border-b border-slate-100">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#C81D25] bg-[#C81D25]/10 px-3 py-1 rounded-full mb-2">
            <span>Quick Answers</span>
          </span>
          <h2 id="faq-heading" className="font-heading font-black text-xl sm:text-2xl gradient-text leading-tight py-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Everything you need to know before securing your raffle entries.
          </p>
        </div>

        <div className="divide-y divide-slate-200/80">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            return (
              <div key={faq.id} className="py-3 first:pt-0 last:pb-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between gap-4 text-left py-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-royal-blue/15"
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-slate-900">
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#C81D25] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    className="mt-2 pr-8 text-xs sm:text-sm text-slate-600 leading-relaxed animate-appear"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
