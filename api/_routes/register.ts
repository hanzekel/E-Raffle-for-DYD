import { withMiddleware } from '../_lib/middleware';
import { registrationSchema } from '../_lib/validation';
import { ApiError } from '../_lib/errors';

async function handler(req: any, res: any) {
  const result = registrationSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, result.error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR');
  }

  const data = result.data;
  const TICKET_PRICE = Number(process.env.TICKET_PRICE || '100');
  const totalAmount = data.ticketCount * TICKET_PRICE;

  return res.status(200).json({
    success: true,
    data: {
      totalAmount,
      ticketCount: data.ticketCount,
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
