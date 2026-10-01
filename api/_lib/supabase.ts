import { createClient } from '@supabase/supabase-js';
import { ApiError } from './errors';

export function createSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are missing');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function uploadFile(bucket: string, filePath: string, fileBuffer: Buffer, contentType: string): Promise<string> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, fileBuffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new ApiError(500, `Failed to upload file: ${error.message}`, 'UPLOAD_ERROR');
  }

  return data.path;
}

export async function getSignedUrl(bucket: string, filePath: string, expiresIn: number = 3600): Promise<string> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new ApiError(500, `Failed to generate signed URL: ${error.message}`, 'SIGNED_URL_ERROR');
  }

  return data.signedUrl;
}

export async function createSignedUploadUrl(bucket: string, filePath: string): Promise<{ signedUrl: string, path: string, token: string }> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(filePath);

  if (error) {
    throw new ApiError(500, `Failed to generate upload URL: ${error.message}`, 'UPLOAD_URL_ERROR');
  }

  return {
    signedUrl: data.signedUrl,
    path: data.path,
    token: data.token,
  };
}

export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new ApiError(500, `Failed to delete file: ${error.message}`, 'DELETE_ERROR');
  }
}

export function validateFileMetadata(contentType: string, sizeBytes: number): void {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(contentType)) {
    throw new ApiError(400, 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.', 'INVALID_FILE_TYPE');
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (sizeBytes > MAX_SIZE) {
    throw new ApiError(400, 'File size exceeds the 5MB limit.', 'FILE_TOO_LARGE');
  }
}
