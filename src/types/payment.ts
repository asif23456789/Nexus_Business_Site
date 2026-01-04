export type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'deal-funding';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type PaymentMethod = 'credit-card' | 'bank-account' | 'paypal' | 'crypto';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  senderId?: string;
  senderName?: string;
  senderRole?: 'entrepreneur' | 'investor';
  receiverId?: string;
  receiverName?: string;
  receiverRole?: 'entrepreneur' | 'investor';
  description: string;
  paymentMethod?: PaymentMethod;
  dealId?: string;
  dealName?: string;
  createdAt: Date;
  completedAt?: Date;
  fee?: number;
  notes?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  availableBalance: number;
  pendingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
  lastUpdated: Date;
}

export interface PaymentMethodInfo {
  id: string;
  type: PaymentMethod;
  isDefault: boolean;
  last4?: string; // Last 4 digits of card/account
  brand?: string; // Visa, Mastercard, etc.
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  email?: string; // For PayPal
  walletAddress?: string; // For crypto
  isVerified: boolean;
  addedAt: Date;
}

export interface FundingRequest {
  id: string;
  dealId: string;
  dealName: string;
  entrepreneurId: string;
  entrepreneurName: string;
  investorId: string;
  investorName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  respondedAt?: Date;
  completedAt?: Date;
  notes?: string;
  terms?: string;
}

export interface DepositData {
  amount: number;
  paymentMethodId: string;
  notes?: string;
}

export interface WithdrawData {
  amount: number;
  paymentMethodId: string;
  notes?: string;
}

export interface TransferData {
  amount: number;
  recipientId: string;
  recipientName: string;
  notes?: string;
  dealId?: string;
}