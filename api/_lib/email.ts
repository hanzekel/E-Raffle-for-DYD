// Transactional email helpers using Nodemailer SMTP
import nodemailer from 'nodemailer';

function getSenderAddress(): string {
  return process.env.EMAIL_FROM || (process.env.SMTP_USER ? `DYD 2026 Raffle <${process.env.SMTP_USER}>` : 'noreply@dyd26.com');
}

function getFrontendUrl(): string {
  const configured = process.env.FRONTEND_URL?.trim().replace(/\/+$/, '');
  const isLocalhost = !configured || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configured);
  if (!isLocalhost && configured) {
    return configured;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
    ? 'https://dyd26-raffle.vercel.app'
    : configured || 'https://dyd26-raffle.vercel.app';
}

export function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Sent right away when an attendee submits their GCash receipt
export async function sendSubmissionConfirmationEmail(registration: {
  id: string;
  fullName: string;
  email: string;
  ticketCount: number;
  totalAmount: number;
  referenceNumber: string;
}) {
  const transporter = createTransport();
  const frontendUrl = getFrontendUrl();
  const checkLink = `${frontendUrl}/verify?orderId=${encodeURIComponent(registration.id)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px;">
      <h2 style="color: #1A3A8F; margin-top: 0;">We got your GCash receipt!</h2>
      <p>Hey <strong>${registration.fullName}</strong>,</p>
      <p>Thanks for joining the <strong>DYD 2026 Grand Raffle</strong>! We received your GCash payment details and our team is checking it now.</p>

      <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #F5A623; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 4px 0;"><strong>Ticket Code:</strong> <span style="font-family: monospace;">${registration.id}</span></p>
        <p style="margin: 4px 0;"><strong>Entries:</strong> ${registration.ticketCount} ${registration.ticketCount === 1 ? 'Ticket' : 'Tickets'} (&#8369;${registration.totalAmount})</p>
        <p style="margin: 4px 0;"><strong>GCash Reference #:</strong> ${registration.referenceNumber}</p>
      </div>

      <p>Once approved, we&apos;ll send your official PDF raffle tickets straight to this email! You can also check your status anytime using your Ticket Code here:</p>
      <p><a href="${checkLink}" style="color: #1A3A8F; font-weight: bold;">Check My Ticket Status</a></p>

      <p style="margin-top: 24px;">Take Courage!<br/><strong>MOPCY DYD 2026 Team</strong></p>
    </div>
  `;

  await transporter.sendMail({
    from: getSenderAddress(),
    to: registration.email,
    subject: 'We got your GCash receipt! — DYD 2026 Raffle',
    html,
  });
}

// Sent once admin verifies the GCash receipt and generates ticket PDFs
export async function sendApprovalEmail(
  registration: { fullName: string; email: string; ticketCount: number },
  pdfBuffers: { filename: string; content: Buffer }[]
) {
  const transporter = createTransport();

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px;">
      <h2 style="color: #1A3A8F; margin-top: 0;">You&apos;re in the DYD 2026 Raffle!</h2>
      <p>Hey <strong>${registration.fullName}</strong>,</p>
      <p>Good news! Your GCash payment is approved and your <strong>${registration.ticketCount}</strong> official raffle ${registration.ticketCount === 1 ? 'ticket is' : 'tickets are'} attached below.</p>

      <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #F5A623; margin: 20px 0; border-radius: 6px;">
        <h3 style="margin-top: 0; color: #1A3A8F;">Event Details</h3>
        <p style="margin: 4px 0;"><strong>Theme:</strong> Take Courage, Youth in Christ: 40 Years in Mission</p>
        <p style="margin: 4px 0;"><strong>Venue:</strong> General Headquarters (GHQ), Philippines</p>
        <p style="margin: 4px 0;"><strong>Year:</strong> 2026</p>
      </div>

      <p>Save your ticket PDFs! Each ticket has its own QR code for easy checking on event day.</p>
      <p style="margin-top: 24px;">Take Courage!<br/><strong>MOPCY DYD 2026 Team</strong></p>
    </div>
  `;

  await transporter.sendMail({
    from: getSenderAddress(),
    to: registration.email,
    subject: 'Your DYD 2026 Raffle Tickets are here!',
    html,
    attachments: pdfBuffers.map(pdf => ({
      filename: pdf.filename,
      content: pdf.content,
      contentType: 'application/pdf',
    })),
  });
}

export async function sendVerificationEmail(email: string, orderId: string, token: string) {
  const transporter = createTransport();
  const frontendUrl = getFrontendUrl();
  const verificationLink = `${frontendUrl}/tickets/${orderId}?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px;">
      <h2 style="color: #1A3A8F; margin-top: 0;">Here&apos;s your ticket link — DYD 2026</h2>
      <p>Hey there,</p>
      <p>Click the button below to view and download your DYD 2026 raffle tickets:</p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${verificationLink}" style="background-color: #1A3A8F; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View My Tickets</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
      <p style="font-size: 12px; color: #64748b;">This link stays active for 1 hour.</p>
      <p style="margin-top: 24px;">Take Courage!<br/><strong>MOPCY DYD 2026 Team</strong></p>
    </div>
  `;

  await transporter.sendMail({
    from: getSenderAddress(),
    to: email,
    subject: 'Your DYD 2026 Ticket Link',
    html,
  });
}
