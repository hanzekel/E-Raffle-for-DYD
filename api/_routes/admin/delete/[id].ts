// Admin endpoint for fast single-query permanent deletion with cascading cleanup
import { withMiddleware } from '../../../_lib/middleware';
import { prisma } from '../../../_lib/prisma';
import { ApiError } from '../../../_lib/errors';
import { deleteFile } from '../../../_lib/supabase';

async function handler(req: any, res: any) {
  const id = req.query.id || req.params?.id || req.query.orderId || req.params?.orderId;

  if (!id) {
    throw new ApiError(400, 'Registration ID is required', 'MISSING_ID');
  }

  try {
    // Single DB roundtrip (cascades to linked tickets and winner records)
    const deleted = await prisma.registration.delete({
      where: { id },
      select: {
        id: true,
        fullName: true,
        proofOfPaymentUrl: true,
      },
    });

    // Clean up proof image from Supabase Storage without blocking the response
    if (deleted.proofOfPaymentUrl) {
      const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'dyd26-uploads';
      deleteFile(bucket, deleted.proofOfPaymentUrl).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      data: {
        deletedId: deleted.id,
        deletedFullName: deleted.fullName,
      },
    });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      throw new ApiError(404, 'Entry not found or already deleted', 'NOT_FOUND');
    }
    throw err;
  }
}

export default withMiddleware(handler, {
  methods: ['POST', 'DELETE'],
  requireAuth: true,
});
