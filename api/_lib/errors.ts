import type { VercelResponse } from '@vercel/node';

export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(statusCode: number, message: string, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function handleApiError(error: unknown, res: VercelResponse) {
  console.error('API Error:', error); // Log for internal visibility but not exposed

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  // Fallback for unhandled errors
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
}
