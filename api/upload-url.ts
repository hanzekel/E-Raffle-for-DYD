import { withMiddleware } from './_lib/middleware';
import { validateFileMetadata, createSignedUploadUrl } from './_lib/supabase';
import { ApiError } from './_lib/errors';
import crypto from 'crypto';

async function handler(req: any, res: any) {
  const { contentType, fileSize } = req.body;

  if (!contentType || !fileSize) {
    throw new ApiError(400, 'contentType and fileSize are required', 'MISSING_FIELDS');
  }

  validateFileMetadata(contentType, fileSize);

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'dyd26-uploads';
  const uuid = crypto.randomUUID();
  // extension from contentType (simple check)
  const ext = contentType.split('/')[1] === 'jpeg' ? 'jpg' : contentType.split('/')[1];
  const filePath = `proofs/${uuid}.${ext}`;

  const { signedUrl, path, token } = await createSignedUploadUrl(bucket, filePath);

  return res.status(200).json({
    success: true,
    data: {
      uploadUrl: signedUrl,
      filePath: path,
      token,
    },
  });
}

export default withMiddleware(handler, {
  methods: ['POST'],
  rateLimit: {
    max: 10,
    windowMinutes: 60, // 10 per hour
  },
});
