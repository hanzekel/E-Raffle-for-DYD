import { withMiddleware } from '../../_lib/middleware';
import { prisma } from '../../_lib/prisma';
import { ApiError } from '../../_lib/errors';

async function handler(req: any, res: any) {
  const id = req.query.id || req.params?.id || req.query.orderId || req.params?.orderId;
  const { rejectionNote } = req.body;

  const registration = await prisma.registration.findUnique({
    where: { id },
  });

  if (!registration) {
    throw new ApiError(404, 'Registration not found', 'NOT_FOUND');
  }

  if (registration.status === 'rejected') {
    throw new ApiError(400, 'Registration is already rejected', 'INVALID_STATUS');
  }

  // Remove any tickets if previously approved to deduct from eligible entries
  await prisma.ticket.deleteMany({
    where: { registrationId: id },
  });

  await prisma.registration.update({
    where: { id },
    data: { 
      status: 'rejected',
      rejectionNote: rejectionNote ? String(rejectionNote).trim() : null,
    },
  });

  return res.status(200).json({
    success: true,
  });
}

export default withMiddleware(handler, {
  methods: ['POST'],
  requireAuth: true,
});
