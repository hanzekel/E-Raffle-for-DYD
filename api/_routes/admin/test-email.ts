// Admin-only SMTP diagnostic route to check live env config and test sending
import { withMiddleware } from '../../_lib/middleware';
import { createTransport } from '../../_lib/email';

function hasEdgeQuotes(val?: string): boolean {
  if (!val) return false;
  return /^["']|["']$/.test(val.trim());
}

async function handler(req: any, res: any) {
  const host = process.env.SMTP_HOST || '';
  const port = process.env.SMTP_PORT || '';
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.EMAIL_FROM || '';
  const frontendUrl = process.env.FRONTEND_URL || '';

  const configSummary = {
    host: host || '(missing)',
    port: port || '(missing, defaults 587)',
    user: user || '(missing)',
    from: from || '(missing)',
    frontendUrl: frontendUrl || '(missing)',
    passSet: pass.length > 0,
    passLength: pass.length,
    hasQuotes:
      hasEdgeQuotes(host) ||
      hasEdgeQuotes(port) ||
      hasEdgeQuotes(user) ||
      hasEdgeQuotes(pass) ||
      hasEdgeQuotes(from),
  };

  if (!host || !user || !pass) {
    return res.status(200).json({
      success: true,
      data: {
        sent: false,
        error: 'One or more required SMTP environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS) are missing in this deployment.',
        config: configSummary,
      },
    });
  }

  const target = (typeof req.body?.to === 'string' && req.body.to.trim()) || user;

  try {
    const transporter = createTransport();
    await transporter.verify();
    const info = await transporter.sendMail({
      from: from || `DYD 2026 Raffle <${user}>`,
      to: target,
      subject: 'DYD 2026 Email Diagnostic Test',
      text: `Live email test succeeded at ${new Date().toISOString()} from ${frontendUrl || 'production'}.`,
    });

    return res.status(200).json({
      success: true,
      data: {
        sent: true,
        to: target,
        response: info.response,
        config: configSummary,
      },
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      data: {
        sent: false,
        to: target,
        error: err?.message || 'SMTP connection or login failed',
        config: configSummary,
      },
    });
  }
}

export default withMiddleware(handler, {
  methods: ['POST'],
  requireAuth: true,
});
