export interface ConfigData {
  ticketPrice: number;
  maxTickets: number;
  gcashNumber: string;
  gcashName: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  campNames: string[];
  drawDate?: string;
  eligibleEntries?: number;
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
  proofOfPaymentUrl?: string;
  proofOfPaymentSignedUrl?: string;
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
  proofOfPaymentUrl?: string;
  proofOfPaymentSignedUrl?: string;
}

export interface AdminDashboardData {
  registrations: Registration[];
  total: number;
  page: number;
  totalPages: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  eligibleEntries: number;
}

export interface AdminWinner {
  id: string;
  prizeName: string;
  ticketNumber: string;
  drawnAt: string;
  drawnByAdmin: string;
  verificationHash: string;
  isVoided: boolean;
  voidReason?: string;
  voidedAt?: string;
  registration: {
    id: string;
    fullName: string;
    email: string;
    campName: string;
    referenceNumber: string;
    paymentMethod: string;
  };
}

export interface EligiblePoolTicket {
  id: string;
  ticketNumber: string;
  createdAt: string;
  registration: {
    fullName: string;
    campName: string;
    status: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
