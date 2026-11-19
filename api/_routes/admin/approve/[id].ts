import { withMiddleware } from '../../../_lib/middleware';
import { prisma } from '../../../_lib/prisma';
import { ApiError } from '../../../_lib/errors';
import { generateAllTickets } from '../../../_lib/pdf';
import { sendApprovalEmail } from '../../../_lib/email';

async function handler(req: any, res: any) {
  const id = req.query.id || req.params?.id || req.query.orderId || req.params?.orderId;

  const registration = await prisma.registration.findUnique({
    where: { id },
  });

  if (!registration) {
    throw new ApiError(404, 'Registration not found', 'NOT_FOUND');
  }

  if (registration.status !== 'pending') {
    throw new ApiError(400, `Registration is already ${registration.status}`, 'INVALID_STATUS');
  }

  const { tickets, pdfBuffers } = await generateAllTickets(registration);

  await prisma.registration.update({
    where: { id },
    data: { status: 'approved' },
  });

  let emailSent = false;
  let emailError: string | undefined;

  try {
    await sendApprovalEmail(
      { fullName: registration.fullName, email: registration.email, ticketCount: registration.ticketCount },
      pdfBuffers
    );
    emailSent = true;
  } catch (error: any) {
    console.error('Failed to send approval email:', error);
    emailError = error?.message || 'Email server rejected login credentials';
  }

  return res.status(200).json({
    success: true,
    data: {
      ticketsGenerated: tickets.length,
      emailSent,
      emailError,
    },
  });
}

export default withMiddleware(handler, {
  methods: ['POST'],
  requireAuth: true,
});
