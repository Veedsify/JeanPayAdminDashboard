// Admin Transactions Types
export interface TransactionStatus {
  PENDING: "PENDING";
  COMPLETED: "COMPLETED";
  FAILED: "FAILED";
  CANCELLED: "CANCELLED";
}

export interface TransactionType {
  DEPOSIT: "DEPOSIT";
  WITHDRAWAL: "WITHDRAWAL";
  CONVERSION: "CONVERSION";
  TRANSFER: "TRANSFER";
}

export interface TransactionDirection {
  DEPOSIT: "DEPOSIT";
  WITHDRAWAL: "WITHDRAWAL";
}

export interface PaymentMethod {
  MOMO: "MOMO";
  PAYSTACK: "PAYSTACK";
  BANK_TRANSFER: "BANK_TRANSFER";
}

export interface TransactionDetails {
  id: number;
  transaction_id: string;
  account_number?: string;
  bank_code?: string;
  bank_name?: string;
  phone_number?: string;
  network?: string;
  recipient_name?: string;
  payment_reference?: string;
  from_amount: number;
  to_amount: number;
  from_currency: string;
  to_currency: string;
  created_at: string;
  updated_at: string;
}

export interface UserBasicInfo {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_picture?: string;
}

export interface Transaction {
  id: number;
  transaction_id: string;
  user_id: number;
  amount: number;
  currency: string;
  status: string;
  transaction_type: string;
  reference: string;
  current_rate: number;
  direction: string;
  description: string;
  payment_type: string;
  created_at: string;
  updated_at: string;
}

type TransactionDetailData = {
  transaction: Transaction;
  user: UserBasicInfo;
  transaction_details: TransactionDetails;
};

export interface TransactionWithUser {
  transaction_id: string;
  user_id: number;
  amount: number;
  currency: string;
  status: string;
  transaction_type: string;
  reference: string;
  direction: string;
  description: string;
  created_at: string;
  payment_type: string;
  user?: UserBasicInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TransactionsResponse {
  transactions: TransactionWithUser[];
  pagination: PaginationInfo;
}

// Query Parameters (matches backend AdminTransactionQuery)
export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
}

export interface TransactionFilter {
  status?: keyof TransactionStatus;
  type?: keyof TransactionType;
  currency?: string;
  direction?: keyof TransactionDirection;
  fromDate?: string;
  toDate?: string;
  paymentMethod?: keyof PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

// Transaction Actions
export interface ApproveTransactionRequest {
  transactionId: string;
  adminNotes?: string;
}

export interface RejectTransactionRequest {
  transactionId: string;
  reason: string;
  adminNotes?: string;
}

export interface UpdateTransactionStatusRequest {
  status: keyof TransactionStatus;
  reason?: string;
  adminNotes?: string;
}

export interface AdminActionResponse {
  success: boolean;
  message: string;
  timestamp: string;
  actionedBy?: number;
}

// Transaction Details Extended
export interface TransactionDetailsResponse extends Transaction {
  statusHistory: TransactionStatusHistory[];
  relatedTransactions: Transaction[];
  adminNotes: AdminNote[];
  riskAssessment: RiskAssessment;
}

export interface TransactionStatusHistory {
  id: number;
  transaction_id: string;
  status: keyof TransactionStatus;
  updated_by: number;
  updated_at: string;
  reason?: string;
  admin_notes?: string;
}

export interface AdminNote {
  id: number;
  transaction_id: string;
  admin_id: number;
  note: string;
  created_at: string;
  admin: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface RiskAssessment {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  factors: string[];
  recommendations: string[];
  lastAssessed: string;
}

// Transaction Overview & Analytics (matches backend response)
export interface TransactionOverview {
  total_transactions: number;
  pending_transactions: number;
  completed_transactions: number;
  failed_transactions: number;
  cancelled_transactions: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface CurrencyVolume {
  currency: string;
  volume: number;
  count: number;
}

// Transaction Statistics
export interface TransactionStats {
  today: {
    count: number;
    volume: number;
    successful: number;
    failed: number;
  };
  thisWeek: {
    count: number;
    volume: number;
    successful: number;
    failed: number;
  };
  thisMonth: {
    count: number;
    volume: number;
    successful: number;
    failed: number;
  };
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

// API Response Types
export interface TransactionsApiResponse {
  error: boolean;
  message: string;
  data: TransactionsResponse;
}

export interface TransactionDetailsApiResponse {
  error: boolean;
  message: string;
  data: TransactionDetailData;
}

export interface TransactionOverviewApiResponse {
  error: boolean;
  message: string;
  data: TransactionOverview;
}

export interface TransactionStatsApiResponse {
  error: boolean;
  message: string;
  data: TransactionStats;
}

export interface TransactionActionApiResponse {
  error: boolean;
  message: string;
  data: AdminActionResponse;
}

// Transaction Management Actions
export type TransactionAction =
  | "approve"
  | "reject"
  | "cancel"
  | "review"
  | "flag";

export interface TransactionActionPayload {
  action: TransactionAction;
  transactionId: string;
  reason?: string;
  adminNotes?: string;
  data?: Record<string, unknown>;
}

// Bulk Operations
export interface BulkTransactionAction {
  action: TransactionAction;
  transactionIds: string[];
  reason?: string;
  adminNotes?: string;
}

export interface BulkActionResponse {
  success: boolean;
  message: string;
  processed: number;
  failed: number;
  errors: Array<{
    transactionId: string;
    error: string;
  }>;
}
