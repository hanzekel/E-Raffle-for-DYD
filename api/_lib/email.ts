import nodemailer from 'nodemailer';

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

export async function sendApprovalEmail(
  registration: { fullName: string; email: string; ticketCount: number },
  pdfBuffers: { filename: string; content: Buffer }[]
) {
  const transporter = createTransport();

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="color: #1A3A8F;">🎟️ DYD26 Raffle Ticket(s) Approved!</h2>
      <p>Dear <strong>${registration.fullName}</strong>,</p>
      <p>Congratulations! Your payment has been verified and your <strong>${registration.ticketCount}</strong> raffle ticket(s) are attached to this email.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #F5A623; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1A3A8F;">Event Details</h3>
        <p><strong>Theme:</strong> Take Courage, Youth in Christ: 40 Years in Mission</p>
        <p><strong>Venue:</strong> General Headquarters (GHQ), Philippines</p>
        <p><strong>Date:</strong> 2026</p>
      </div>
      
      <p>Please keep these tickets safe. The QR code on each ticket will be used for validation.</p>
      <p>Take Courage!</p>
      <p>— The MOPCY DYD 2026 Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: registration.email,
    subject: '🎟️ Your DYD26 Raffle Ticket/s — Take Courage!',
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
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/tickets/${orderId}?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="color: #1A3A8F;">Verify your email — DYD26 Raffle Tickets</h2>
      <p>Hello,</p>
      <p>You requested to access your DYD26 Raffle Tickets. Please click the button below to view and download them:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #1A3A8F; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View My Tickets</a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
      <p>This link is valid for 1 hour.</p>
      <p>— The MOPCY DYD 2026 Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email — DYD26 Raffle Tickets',
    html,
  });
}
