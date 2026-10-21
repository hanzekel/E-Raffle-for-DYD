import { withMiddleware } from '../_lib/middleware';
import { adminLoginSchema } from '../_lib/validation';
import { ApiError } from '../_lib/errors';
import { verifyPassword, generateToken, setTokenCookie } from '../_lib/auth';
import { prisma } from '../_lib/prisma';

async function handler(req: any, res: any) {
  const result = adminLoginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, result.error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR');
  }

  const { username, password } = result.data;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminPasswordHash) {
    throw new ApiError(500, 'Admin credentials not configured properly', 'CONFIG_ERROR');
  }

  if (username !== adminUsername) {
    throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const isValid = await verifyPassword(password, adminPasswordHash);
  if (!isValid) {
    throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const token = generateToken({ username, role: 'admin' });
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h

  try {
    await prisma.adminSession.create({
      data: {
        token,
        expiresAt,
      },
    });
  } catch (err) {
    console.warn('Admin session database persistence unavailable, continuing with signed JWT session.');
  }

  setTokenCookie(res, token);

  return res.status(200).json({
    success: true,
  });
}

export default withMiddleware(handler, {
  methods: ['POST'],
  rateLimit: {
    max: 5,
    windowMinutes: 15,
  },
});
