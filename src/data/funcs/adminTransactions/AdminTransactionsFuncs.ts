import axiosClient from "@/lib/axios";
import {
  TransactionsApiResponse,
  TransactionDetailsApiResponse,
  TransactionOverviewApiResponse,
  TransactionStatsApiResponse,
  TransactionActionApiResponse,
  TransactionQueryParams,
  ApproveTransactionRequest,
  RejectTransactionRequest,
  UpdateTransactionStatusRequest,
  BulkTransactionAction,
  BulkActionResponse,
  TransactionStatusHistory,
  AdminNote,
  RiskAssessment,
} from "@/types/admin-transactions";

// Get all transactions with pagination and filters
async function getAllTransactions(
  params?: TransactionQueryParams,
): Promise<TransactionsApiResponse> {
  const response = await axiosClient.get("/admin/transactions/all", { params });
  return response.data;
}

// Get transaction details by ID
async function getTransactionDetails(
  transactionId: string,
): Promise<TransactionDetailsApiResponse> {
  const response = await axiosClient.post(
    `/admin/transactions/details/${transactionId}`,
  );
  return response.data;
}

// Get transaction overview and analytics
async function getTransactionOverview(): Promise<TransactionOverviewApiResponse> {
  const response = await axiosClient.get("/admin/transactions/overview");
  return response.data;
}

// Get transaction statistics
async function getTransactionStats(): Promise<TransactionStatsApiResponse> {
  return axiosClient.get("/admin/transactions/stats");
}

// Get transaction status
async function getTransactionStatus(transactionId: string): Promise<{
  error: boolean;
  message: string;
  data: { status: string; updated_at: string };
}> {
  return axiosClient.get(`/admin/transactions/status/${transactionId}`);
}

// Approve a transaction
async function approveTransaction(
  request: ApproveTransactionRequest,
): Promise<TransactionActionApiResponse> {
  return axiosClient.patch(
    `/admin/transactions/approve/${request.transactionId}`,
    {
      adminNotes: request.adminNotes,
    },
  );
}

// Reject a transaction
async function rejectTransaction(
  request: RejectTransactionRequest,
): Promise<TransactionActionApiResponse> {
  return axiosClient.patch(
    `/admin/transactions/reject/${request.transactionId}`,
    {
      reason: request.reason,
      adminNotes: request.adminNotes,
    },
  );
}

// Update transaction status
async function updateTransactionStatus(
  transactionId: string,
  request: UpdateTransactionStatusRequest,
): Promise<TransactionActionApiResponse> {
  return axiosClient.patch(
    `/admin/transactions/status/${transactionId}`,
    request,
  );
}

// Cancel a transaction
async function cancelTransaction(
  transactionId: string,
  reason?: string,
): Promise<TransactionActionApiResponse> {
  return axiosClient.patch(`/admin/transactions/status/${transactionId}`, {
    status: "CANCELLED",
    reason,
  });
}

// Flag a transaction for review
async function flagTransaction(
  transactionId: string,
  reason: string,
): Promise<TransactionActionApiResponse> {
  return axiosClient.patch(`/admin/transactions/status/${transactionId}`, {
    status: "FLAGGED",
    reason,
  });
}

// Get transaction history
async function getTransactionHistory(transactionId: string): Promise<{
  error: boolean;
  message: string;
  data: TransactionStatusHistory[];
}> {
  return axiosClient.get(`/admin/transactions/${transactionId}/history`);
}

// Add admin note to transaction
async function addTransactionNote(
  transactionId: string,
  note: string,
): Promise<TransactionActionApiResponse> {
  return axiosClient.post(`/admin/transactions/${transactionId}/notes`, {
    note,
  });
}

// Get transaction notes
async function getTransactionNotes(
  transactionId: string,
): Promise<{ error: boolean; message: string; data: AdminNote[] }> {
  return axiosClient.get(`/admin/transactions/${transactionId}/notes`);
}

// Search transactions
async function searchTransactions(
  query: string,
): Promise<TransactionsApiResponse> {
  return axiosClient.get("/admin/transactions/all", {
    params: { search: query },
  });
}

// Export transactions
async function exportTransactions(
  params?: TransactionQueryParams,
): Promise<Blob> {
  const response = await axiosClient.post(
    "/admin/transactions/export",
    params,
    {
      responseType: "blob",
    },
  );
  return response.data;
}

// Bulk actions on transactions
async function bulkTransactionAction(
  action: BulkTransactionAction,
): Promise<BulkActionResponse> {
  return axiosClient.post("/admin/transactions/bulk-action", action);
}

// Get failed transactions
async function getFailedTransactions(
  params?: TransactionQueryParams,
): Promise<TransactionsApiResponse> {
  return axiosClient.get("/admin/transactions/failed", { params });
}

// Get pending transactions
async function getPendingTransactions(
  params?: TransactionQueryParams,
): Promise<TransactionsApiResponse> {
  return axiosClient.get("/admin/transactions/pending", { params });
}

// Get high-value transactions
async function getHighValueTransactions(
  params?: TransactionQueryParams,
): Promise<TransactionsApiResponse> {
  return axiosClient.get("/admin/transactions/all", {
    params: { ...params, high_value: true },
  });
}

// Get suspicious transactions
async function getSuspiciousTransactions(
  params?: TransactionQueryParams,
): Promise<TransactionsApiResponse> {
  return axiosClient.get("/admin/transactions/all", {
    params: { ...params, suspicious: true },
  });
}

// Get transaction risk assessment
async function getTransactionRiskAssessment(
  transactionId: string,
): Promise<{ error: boolean; message: string; data: RiskAssessment }> {
  return axiosClient.get(
    `/admin/transactions/${transactionId}/risk-assessment`,
  );
}

// Retry failed transaction
async function retryFailedTransaction(
  transactionId: string,
): Promise<TransactionActionApiResponse> {
  return axiosClient.patch(`/admin/transactions/status/${transactionId}`, {
    status: "PENDING",
    reason: "Retry failed transaction",
  });
}

// Get transaction analytics by date range
async function getTransactionAnalytics(params: {
  fromDate: string;
  toDate: string;
  groupBy?: "day" | "week" | "month";
}): Promise<TransactionOverviewApiResponse> {
  return axiosClient.get("/admin/transactions/overview", { params });
}

export {
  getAllTransactions,
  getTransactionDetails,
  getTransactionOverview,
  getTransactionStats,
  getTransactionStatus,
  approveTransaction,
  rejectTransaction,
  updateTransactionStatus,
  cancelTransaction,
  flagTransaction,
  getTransactionHistory,
  addTransactionNote,
  getTransactionNotes,
  searchTransactions,
  exportTransactions,
  bulkTransactionAction,
  getFailedTransactions,
  getPendingTransactions,
  getHighValueTransactions,
  getSuspiciousTransactions,
  getTransactionRiskAssessment,
  retryFailedTransaction,
  getTransactionAnalytics,
};
