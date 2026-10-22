import { withMiddleware } from '../../_lib/middleware';
import { verifyToken } from '../../_lib/auth';
import { ApiError } from '../../_lib/errors';
import { prisma } from '../../_lib/prisma';
import { getSignedUrl } from '../../_lib/supabase';

async function handler(req: any, res: any) {
  const orderId = req.query.orderId || req.params?.orderId || req.query.id || req.params?.id;
  const token = req.query.token as string;

  if (!token) {
    throw new ApiError(401, 'Verification token is missing', 'MISSING_TOKEN');
  }

  let decoded: any;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired verification token', 'INVALID_TOKEN');
  }

  console.log('decoded.orderId:', decoded.orderId, 'req.query.orderId:', orderId);

  if (decoded.orderId !== orderId) {
    throw new ApiError(403, 'Token does not match this order', 'TOKEN_MISMATCH');
  }

  const registration = await prisma.registration.findUnique({
    where: { id: orderId as string },
    include: { tickets: true },
  });

  if (!registration || registration.email !== decoded.email) {
    throw new ApiError(404, 'Registration not found', 'NOT_FOUND');
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'dyd26-uploads';

  const ticketsWithUrls = await Promise.all(
    registration.tickets.map(async (ticket: any) => {
      let downloadUrl = null;
      if (ticket.pdfUrl) {
        try {
          downloadUrl = await getSignedUrl(bucket, ticket.pdfUrl);
        } catch (e) {
          console.error(`Failed to get signed url for ${ticket.pdfUrl}`);
        }
      }
      return {
        ticketNumber: ticket.ticketNumber,
        downloadUrl,
      };
    })
  );

  return res.status(200).json({
    success: true,
    data: {
      registration: {
        fullName: registration.fullName,
        campName: registration.campName,
        status: registration.status,
      },
      tickets: ticketsWithUrls,
    },
  });
}

export default withMiddleware(handler, {
  methods: ['GET'],
  rateLimit: {
    max: 30,
    windowMinutes: 10,
  },
});
