import { z } from 'zod';
import { withMiddleware } from '../../_lib/middleware';
import { prisma } from '../../_lib/prisma';
import { ApiError } from '../../_lib/errors';

const voidSchema = z.object({
  winnerId: z.string().min(1, 'Winner ID is required'),
  voidReason: z.string().min(5, 'A detailed void reason note (minimum 5 chars) is mandatory for audit compliance'),
});

async function handler(req: any, res: any) {
  const result = voidSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, result.error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR');
  }

  const { winnerId, voidReason } = result.data;

  try {
    const winner = await prisma.raffleWinner.findUnique({
      where: { id: winnerId },
    });

    if (!winner) {
      throw new ApiError(404, 'Winning draw record not found in the vault.', 'WINNER_NOT_FOUND');
    }

    if (winner.isVoided) {
      throw new ApiError(400, 'This winning draw is already voided.', 'ALREADY_VOIDED');
    }

    const updated = await prisma.raffleWinner.update({
      where: { id: winnerId },
      data: {
        isVoided: true,
        voidReason,
        voidedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Winner draw has been voided. Ticket is unlocked for redraw.',
      data: updated,
    });
  } catch (err: any) {
    if (err instanceof ApiError) throw err;

    console.error('Database error during draw void:', err);
    throw new ApiError(
      500,
      'Unable to update the raffle vault database. Void aborted to protect draw integrity.',
      'VAULT_DB_ERROR'
    );
  }
}

export default withMiddleware(handler, {
  methods: ['POST'],
  requireAuth: true,
});

