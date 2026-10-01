import { withMiddleware } from './_lib/middleware';
import { CAMP_NAMES } from './_lib/validation';

async function handler(req: any, res: any) {
  return res.status(200).json({
    success: true,
    data: {
      ticketPrice: Number(process.env.TICKET_PRICE || '100'),
      maxTickets: Number(process.env.MAX_TICKETS_PER_REGISTRATION || '10'),
      gcashNumber: process.env.GCASH_NUMBER,
      gcashName: process.env.GCASH_NAME,
      bankName: process.env.BANK_NAME,
      bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER,
      bankAccountName: process.env.BANK_ACCOUNT_NAME,
      campNames: CAMP_NAMES,
    },
  });
}

export default withMiddleware(handler, {
  methods: ['GET'],
});
