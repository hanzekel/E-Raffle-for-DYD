// Public eligible tickets endpoint for live stage draw pool
import { withMiddleware } from '../../_lib/middleware';
import { prisma } from '../../_lib/prisma';

function maskParticipantName(fullName: string): string {
  if (!fullName) return 'Participant';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].length > 2 ? `${parts[0].slice(0, 2)}***` : `${parts[0]}*`;
  }
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0];
  return `${firstName} ${lastInitial}.***`;
}

async function handler(_req: any, res: any) {
  try {
    // Only return tickets from approved registrations that haven't won an active prize
    const validTickets = await prisma.ticket.findMany({
      where: {
        registration: { status: 'approved' },
        OR: [
          { winner: null },
          { winner: { isVoided: true } },
        ],
      },
      include: {
        registration: {
          select: { fullName: true, campName: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = validTickets.map(t => ({
      id: t.id,
      ticketNumber: t.ticketNumber,
      createdAt: t.createdAt,
      registration: {
        fullName: maskParticipantName(t.registration.fullName),
        campName: t.registration.campName,
        status: t.registration.status,
      },
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.warn("Database connection failed, returning empty tickets list.", err);
    return res.status(200).json({
      success: true,
      data: [],
    });
  }
}

export default withMiddleware(handler, {
  methods: ['GET'],
  rateLimit: {
    max: 120,
    windowMinutes: 1,
  },
});
