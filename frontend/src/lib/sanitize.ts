import DOMPurify from 'dompurify';

export const sanitizeInput = (value: string): string => {
  return DOMPurify.sanitize(value).trim();
};

export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = { ...data };
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key] as string) as any;
    }
  }
  return sanitized;
};
