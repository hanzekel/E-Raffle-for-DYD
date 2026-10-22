import { withMiddleware } from '../../_lib/middleware';
import { ApiError } from '../../_lib/errors';
import { prisma } from '../../_lib/prisma';
import { generateToken } from '../../_lib/auth';
import { sendVerificationEmail } from '../../_lib/email';
import { z } from 'zod';

const requestSchema = z.object({
  email: z.string().email(),
  orderId: z.string().uuid(),
});

async function handler(req: any, res: any) {
  const result = requestSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, result.error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR');
  }

  const { email, orderId } = result.data;

  const registration = await prisma.registration.findUnique({
    where: { id: orderId },
  });

  if (!registration) {
    throw new ApiError(404, 'Order not found', 'NOT_FOUND');
  }

  if (registration.email !== email) {
    throw new ApiError(403, 'Email does not match the order', 'EMAIL_MISMATCH');
  }

  const token = generateToken({ email, orderId }); // uses JWT_SECRET and JWT_EXPIRY
  await sendVerificationEmail(email, orderId, token);

  return res.status(200).json({
    success: true,
    message: 'Verification email sent',
  });
}

export default withMiddleware(handler, {
  methods: ['POST'],
  rateLimit: {
    max: 5,
    windowMinutes: 15,
  },
});
