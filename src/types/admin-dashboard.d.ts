// Admin Dashboard Types
export interface DashboardSummary {
  totalUsers: number;
  totalTransactions: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
}

export interface MonthlyVolume {
  direction: "DEPOSIT" | "TRANSFER";
  total: number;
  count: number;
}

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
  transaction_details: any;
  user?: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
}

export interface DashboardResponse {
  summary: DashboardSummary;
  monthlyVolume: MonthlyVolume[];
  recentTransactions: TransactionWithUser[];
}

// Dashboard Query Types
export interface DashboardStatsParams {
  from_date?: string;
  to_date?: string;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface DashboardMetrics {
  userGrowth: {
    current: number;
    previous: number;
    percentage: number;
  };
  transactionVolume: {
    current: number;
    previous: number;
    percentage: number;
  };
  revenue: {
    current: number;
    previous: number;
    percentage: number;
  };
  conversionRate: {
    current: number;
    previous: number;
    percentage: number;
  };
}

// API Response Types
export interface DashboardApiResponse {
  error: boolean;
  message: string;
  data: DashboardResponse;
}

export interface DashboardStatsApiResponse {
  error: boolean;
  message: string;
  data: DashboardMetrics;
}
