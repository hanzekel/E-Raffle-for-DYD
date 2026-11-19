import { withMiddleware } from '../_lib/middleware';
import { registrationSchema, paymentSchema } from '../_lib/validation';
import { ApiError } from '../_lib/errors';
import { prisma } from '../_lib/prisma';
import { sendSubmissionConfirmationEmail } from '../_lib/email';

const fullSchema = registrationSchema.and(paymentSchema);

async function handler(req: any, res: any) {
  const result = fullSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, result.error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR');
  }

  const data = result.data;
  
  // TODO: integrate ClamAV or similar for virus scanning on the uploaded file

  // Check duplicate reference number
  const existing = await prisma.registration.findUnique({
    where: { referenceNumber: data.referenceNumber },
  });

  if (existing) {
    throw new ApiError(
      409,
      `Reference number "${data.referenceNumber}" already exists in our system. Please check and enter the new Reference Number from your GCash receipt.`,
      'DUPLICATE_REFERENCE',
    );
  }

  const TICKET_PRICE = Number(process.env.TICKET_PRICE || '100');
  const totalAmount = data.ticketCount * TICKET_PRICE;

  const registration = await prisma.registration.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      contactNumber: data.contactNumber,
      campName: data.campName,
      ticketCount: data.ticketCount,
      totalAmount,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      proofOfPaymentUrl: data.proofOfPaymentPath,
      status: 'pending',
    },
  });

  // Send non-blocking submission receipt email so valid registrations never fail on SMTP
  let emailSent = false;
  try {
    await sendSubmissionConfirmationEmail({
      id: registration.id,
      fullName: registration.fullName,
      email: registration.email,
      ticketCount: registration.ticketCount,
      totalAmount,
      referenceNumber: registration.referenceNumber,
    });
    emailSent = true;
  } catch (err) {
    console.warn('Submission confirmation email failed:', (err as any)?.message || err);
  }

  return res.status(200).json({
    success: true,
    data: {
      registrationId: registration.id,
      emailSent,
    },
  });
}

export default withMiddleware(handler, {
  methods: ['POST'],
  rateLimit: {
    max: 10,
    windowMinutes: 60, // 10 per hour
  },
});
