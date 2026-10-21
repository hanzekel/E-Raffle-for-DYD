// Admin endpoint for full audit ledger of raffle winners
import { withMiddleware } from '../_lib/middleware';
import { prisma } from '../_lib/prisma';

async function handler(_req: any, res: any) {
  try {
    const winners = await prisma.raffleWinner.findMany({
      orderBy: { drawnAt: 'desc' },
      include: {
        ticket: {
          include: {
            registration: {
              select: {
                id: true,
                fullName: true,
                email: true,
                campName: true,
                referenceNumber: true,
                paymentMethod: true,
              },
            },
          },
        },
      },
    });

    const data = winners.map(w => ({
      id: w.id,
      prizeName: w.prizeName,
      ticketNumber: w.ticket.ticketNumber,
      drawnAt: w.drawnAt,
      drawnByAdmin: w.drawnByAdmin,
      verificationHash: w.verificationHash,
      isVoided: w.isVoided,
      voidReason: w.voidReason,
      voidedAt: w.voidedAt,
      registration: {
        id: w.ticket.registration.id,
        fullName: w.ticket.registration.fullName,
        email: w.ticket.registration.email,
        campName: w.ticket.registration.campName,
        referenceNumber: w.ticket.registration.referenceNumber,
        paymentMethod: w.ticket.registration.paymentMethod,
      },
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('Error fetching admin winners:', err);
    return res.status(200).json({
      success: true,
      data: [],
    });
  }
}

export default withMiddleware(handler, {
  methods: ['GET'],
  requireAuth: true,
});

