export interface ConfigData {
  ticketPrice: number;
  maxTickets: number;
  gcashNumber: string;
  gcashName: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  campNames: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  campName: string;
  ticketCount: number;
  paymentMethod: 'gcash' | 'bank';
  referenceNumber: string;
  proofOfPaymentPath: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionNote?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  registrationId: string;
  ticketNumber: string;
  status: 'active' | 'used' | 'void';
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  contactNumber: string;
  campName: string;
  ticketCount: number;
}

export interface PaymentFormData {
  paymentMethod: 'gcash' | 'bank';
  referenceNumber: string;
  proofOfPaymentPath: string;
}

export interface AdminDashboardData {
  registrations: Registration[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
