import { withMiddleware } from '../_lib/middleware';
import { clearTokenCookie, getTokenFromCookies } from '../_lib/auth';
import { prisma } from '../_lib/prisma';

async function handler(req: any, res: any) {
  const token = getTokenFromCookies(req);

  if (token) {
    await prisma.adminSession.deleteMany({
      where: { token },
    });
  }

  clearTokenCookie(res);

  return res.status(200).json({
    success: true,
  });
}

export default withMiddleware(handler, {
  methods: ['POST'],
  requireAuth: true,
});
