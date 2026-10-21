// Admin endpoint to permanently delete a registration and all associated database records
import { withMiddleware } from '../../_lib/middleware';
import { prisma } from '../../_lib/prisma';
import { ApiError } from '../../_lib/errors';

async function handler(req: any, res: any) {
  const id = req.query.id || req.params?.id || req.query.orderId || req.params?.orderId;

  if (!id) {
    throw new ApiError(400, 'Registration ID is required', 'MISSING_ID');
  }

  const registration = await prisma.registration.findUnique({
    where: { id },
    include: {
      tickets: true,
    },
  });

  if (!registration) {
    throw new ApiError(404, 'Registration not found', 'NOT_FOUND');
  }

  // Delete registration (cascades to all linked tickets and winner records)
  await prisma.registration.delete({
    where: { id },
  });

  return res.status(200).json({
    success: true,
    data: {
      deletedId: id,
      deletedFullName: registration.fullName,
      ticketsRemoved: registration.tickets.length,
    },
  });
}

export default withMiddleware(handler, {
  methods: ['POST', 'DELETE'],
  requireAuth: true,
});

