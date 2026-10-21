// Global public configuration with live eligible entries count
import { withMiddleware } from './_lib/middleware';
import { CAMP_NAMES } from './_lib/validation';
import { prisma } from './_lib/prisma';

async function handler(_req: any, res: any) {
  let eligibleEntries = 0;
  try {
    eligibleEntries = await prisma.ticket.count({
      where: {
        registration: { status: 'approved' },
        OR: [
          { winner: null },
          { winner: { isVoided: true } },
        ],
      },
    });
  } catch {
    eligibleEntries = 0;
  }

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
      drawDate: process.env.RAFFLE_DRAW_DATE || '2026-11-28T18:00:00+08:00',
      eligibleEntries,
    },
  });
}

export default withMiddleware(handler, {
  methods: ['GET'],
});
