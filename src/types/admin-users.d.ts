// Admin Users Types
export interface UserBasicInfo {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export type WalletDetailsPage = {
  user_id: number;
  balance_ngn: number;
  balance_ghs: number;
  total_deposits: number;
  total_withdrawals: number;
  total_conversions: number;
  is_active: boolean;
  wallet_id_ngn: number;
  wallet_id_ghs: number;
};

export interface UserCountry {
  id: number;
  name: string;
  code: string;
  currency: string;
  flag: string;
}

export interface UserSetting {
  id: number;
  user_id: number;
  theme: string;
  language: string;
  notifications: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  user_id: string;
  email: string;
  profile_picture: string;
  first_name: string;
  phone_number: string;
  last_name: string;
  username: string;
  is_admin: boolean;
  is_blocked: boolean;
  is_verified: boolean;
  country: UserCountry;
  setting: UserSetting;
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  user_id: number;
  balance_ngn: number;
  balance_ghs: number;
  total_deposits: number;
  total_withdrawals: number;
  wallet_id_ngn: number;
  wallet_id_ghs: number;
  total_conversions: number;
  is_active: boolean;
}

export interface UserWithWallet {
  user: User;
  wallet: WalletBalance | null;
  transactionCount: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse {
  users: UserWithWallet[];
  pagination: PaginationInfo;
}

// Query Parameters
export interface UserQueryParams {
  page?: number;
  limit?: number;
  status?: "verified" | "unverified" | "";
  blocked?: "blocked" | "active" | "";
  search?: string;
}

export interface UserFilter {
  status?: "verified" | "unverified";
  blocked?: "blocked" | "active";
  search?: string;
}

// User Actions
export interface BlockUserRequest {
  userId: string;
  reason: string;
}

export interface UnblockUserRequest {
  userId: string;
}

export interface AdminActionResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// User Details Extended
export interface UserDetailsResponse extends UserWithWallet {
  recentTransactions: TransactionWithUser[];
  accountSummary: {
    totalDeposits: number;
    totalWithdrawals: number;
    totalConversions: number;
    lastLogin: string;
    accountAge: number;
    riskScore: number;
  };
}

export interface TransactionWithUser {
  transaction_id: string;
  user_id: number;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  transaction_type: string;
  reference: string;
  direction: "DEPOSIT" | "WITHDRAWAL";
  description: string;
  created_at: string;
  payment_type: string;
}

// User Statistics
export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  blockedUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

// API Response Types
export interface UsersApiResponse {
  error: boolean;
  message: string;
  data: UsersResponse;
}

export interface UserDetailsApiResponse {
  error: boolean;
  message: string;
  data: UserDetailsResponse;
}

export interface UserStatsApiResponse {
  error: boolean;
  message: string;
  data: UserStats;
}

export interface UserActionApiResponse {
  error: boolean;
  message: string;
  data: T;
}

// User Management Actions
export type UserAction = "block" | "unblock" | "verify" | "delete" | "view";

export interface UserActionPayload {
  action: UserAction;
  userId: string;
  reason?: string;
  data?: T;
}

// Export all types
export type {
  UserBasicInfo,
  UserCountry,
  UserSetting,
  User,
  WalletBalance,
  UserWithWallet,
  PaginationInfo,
  UsersResponse,
  UserQueryParams,
  UserFilter,
  BlockUserRequest,
  UnblockUserRequest,
  AdminActionResponse,
  UserDetailsResponse,
  TransactionWithUser,
  UserStats,
  UsersApiResponse,
  UserDetailsApiResponse,
  UserStatsApiResponse,
  UserActionApiResponse,
  UserAction,
  UserActionPayload,
};
