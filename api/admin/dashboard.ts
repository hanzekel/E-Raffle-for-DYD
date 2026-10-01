import { withMiddleware } from '../_lib/middleware';
import { prisma } from '../_lib/prisma';
import { getSignedUrl } from '../_lib/supabase';

async function handler(req: any, res: any) {
  const status = req.query.status as string;
  const search = req.query.search as string;
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '20', 10);

  const where: any = {};

  if (status && status !== 'all') {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { referenceNumber: { contains: search, mode: 'insensitive' } },
    ];
  }

  const total = await prisma.registration.count({ where });
  const registrations = await prisma.registration.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'dyd26-uploads';

  const registrationsWithUrls = await Promise.all(
    registrations.map(async (reg: any) => {
      let signedUrl = null;
      if (reg.proofOfPaymentUrl) {
        try {
          signedUrl = await getSignedUrl(bucket, reg.proofOfPaymentUrl);
        } catch (e) {
          console.error(`Failed to get signed url for ${reg.proofOfPaymentUrl}`);
        }
      }
      return { ...reg, proofOfPaymentSignedUrl: signedUrl };
    })
  );

  return res.status(200).json({
    success: true,
    data: {
      registrations: registrationsWithUrls,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export default withMiddleware(handler, {
  methods: ['GET'],
  requireAuth: true,
});
