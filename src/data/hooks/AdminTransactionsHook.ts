import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
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
} from "../funcs/adminTransactions/AdminTransactionsFuncs";
import {
  TransactionQueryParams,
  ApproveTransactionRequest,
  RejectTransactionRequest,
  UpdateTransactionStatusRequest,
  BulkTransactionAction,
} from "@/types/admin-transactions";

export default function useAdminTransactions() {
  const queryClient = useQueryClient();

  return {
    // Get all transactions with infinite scroll
    useTransactionsInfinite: (params?: TransactionQueryParams) =>
      useInfiniteQuery({
        queryKey: ["admin", "transactions", "all", params],
        queryFn: ({ pageParam = 1 }) =>
          getAllTransactions({ ...params, page: pageParam as number }),
        getNextPageParam: (lastPage) => {
          const { pagination } = lastPage.data;
          return pagination.page < pagination.pages
            ? pagination.page + 1
            : undefined;
        },
        initialPageParam: 1,
        staleTime: 2 * 60 * 1000, // 2 minutes
      }),

    // Get transactions with regular pagination
    useTransactions: (params?: TransactionQueryParams) =>
      useQuery({
        queryKey: ["admin", "transactions", "paginated", params],
        queryFn: () => getAllTransactions(params),
        staleTime: 2 * 60 * 1000,
      }),

    // Get transaction details
    useTransactionDetails: (transactionId: string) =>
      useQuery({
        queryKey: ["admin", "transactions", "details", transactionId],
        queryFn: () => getTransactionDetails(transactionId),
        enabled: !!transactionId,
        staleTime: 1 * 60 * 1000, // 1 minute
      }),

    // Get transaction overview and analytics
    useTransactionOverview: () =>
      useQuery({
        queryKey: ["admin", "transactions", "overview"],
        queryFn: getTransactionOverview,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 10 * 60 * 1000, // 10 minutes
      }),

    // Get transaction statistics
    useTransactionStats: () =>
      useQuery({
        queryKey: ["admin", "transactions", "stats"],
        queryFn: getTransactionStats,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000,
      }),

    // Get transaction status
    useTransactionStatus: (transactionId: string) =>
      useQuery({
        queryKey: ["admin", "transactions", "status", transactionId],
        queryFn: () => getTransactionStatus(transactionId),
        enabled: !!transactionId,
        staleTime: 30 * 1000, // 30 seconds
      }),

    // Get transaction history
    useTransactionHistory: (transactionId: string) =>
      useQuery({
        queryKey: ["admin", "transactions", "history", transactionId],
        queryFn: () => getTransactionHistory(transactionId),
        enabled: !!transactionId,
        staleTime: 2 * 60 * 1000,
      }),

    // Get transaction notes
    useTransactionNotes: (transactionId: string) =>
      useQuery({
        queryKey: ["admin", "transactions", "notes", transactionId],
        queryFn: () => getTransactionNotes(transactionId),
        enabled: !!transactionId,
        staleTime: 1 * 60 * 1000,
      }),

    // Get failed transactions
    useFailedTransactions: (params?: TransactionQueryParams) =>
      useQuery({
        queryKey: ["admin", "transactions", "failed", params],
        queryFn: () => getFailedTransactions(params),
        staleTime: 2 * 60 * 1000,
      }),

    // Get pending transactions
    usePendingTransactions: (params?: TransactionQueryParams) =>
      useQuery({
        queryKey: ["admin", "transactions", "pending", params],
        queryFn: () => getPendingTransactions(params),
        staleTime: 1 * 60 * 1000, // More frequent updates for pending
        refetchInterval: 2 * 60 * 1000, // 2 minutes
      }),

    // Get high-value transactions
    useHighValueTransactions: (params?: TransactionQueryParams) =>
      useQuery({
        queryKey: ["admin", "transactions", "high-value", params],
        queryFn: () => getHighValueTransactions(params),
        staleTime: 5 * 60 * 1000,
      }),

    // Get suspicious transactions
    useSuspiciousTransactions: (params?: TransactionQueryParams) =>
      useQuery({
        queryKey: ["admin", "transactions", "suspicious", params],
        queryFn: () => getSuspiciousTransactions(params),
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000, // 5 minutes
      }),

    // Get transaction risk assessment
    useTransactionRiskAssessment: (transactionId: string) =>
      useQuery({
        queryKey: ["admin", "transactions", "risk-assessment", transactionId],
        queryFn: () => getTransactionRiskAssessment(transactionId),
        enabled: !!transactionId,
        staleTime: 5 * 60 * 1000,
      }),

    // Search transactions
    useSearchTransactions: (query: string) =>
      useQuery({
        queryKey: ["admin", "transactions", "search", query],
        queryFn: () => searchTransactions(query),
        enabled: !!query && query.length >= 2,
        staleTime: 1 * 60 * 1000,
      }),

    // Get transaction analytics
    useTransactionAnalytics: (params: {
      fromDate: string;
      toDate: string;
      groupBy?: "day" | "week" | "month";
    }) =>
      useQuery({
        queryKey: ["admin", "transactions", "analytics", params],
        queryFn: () => getTransactionAnalytics(params),
        enabled: !!(params.fromDate && params.toDate),
        staleTime: 5 * 60 * 1000,
      }),

    // Approve transaction mutation
    useApproveTransaction: () =>
      useMutation({
        mutationFn: (request: ApproveTransactionRequest) =>
          approveTransaction(request),
        onSuccess: (data, variables) => {
          // Invalidate related queries
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions"],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "admin",
              "transactions",
              "details",
              variables.transactionId,
            ],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions", "pending"],
          });
          console.log("Transaction approved successfully");
        },
        onError: (error) => {
          console.error("Error approving transaction:", error);
        },
      }),

    // Reject transaction mutation
    useRejectTransaction: () =>
      useMutation({
        mutationFn: (request: RejectTransactionRequest) =>
          rejectTransaction(request),
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions"],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "admin",
              "transactions",
              "details",
              variables.transactionId,
            ],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions", "pending"],
          });
          console.log("Transaction rejected successfully");
        },
        onError: (error) => {
          console.error("Error rejecting transaction:", error);
        },
      }),

    // Update transaction status mutation
    useUpdateTransactionStatus: () =>
      useMutation({
        mutationFn: ({
          transactionId,
          request,
        }: {
          transactionId: string;
          request: UpdateTransactionStatusRequest;
        }) => updateTransactionStatus(transactionId, request),
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions"],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "admin",
              "transactions",
              "details",
              variables.transactionId,
            ],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "admin",
              "transactions",
              "status",
              variables.transactionId,
            ],
          });
          console.log("Transaction status updated successfully");
        },
        onError: (error) => {
          console.error("Error updating transaction status:", error);
        },
      }),

    // Cancel transaction mutation
    useCancelTransaction: () =>
      useMutation({
        mutationFn: ({
          transactionId,
          reason,
        }: {
          transactionId: string;
          reason?: string;
        }) => cancelTransaction(transactionId, reason),
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions"],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "admin",
              "transactions",
              "details",
              variables.transactionId,
            ],
          });
          console.log("Transaction cancelled successfully");
        },
        onError: (error) => {
          console.error("Error cancelling transaction:", error);
        },
      }),

    // Flag transaction mutation
    useFlagTransaction: () =>
      useMutation({
        mutationFn: ({
          transactionId,
          reason,
        }: {
          transactionId: string;
          reason: string;
        }) => flagTransaction(transactionId, reason),
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions"],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "admin",
              "transactions",
              "details",
              variables.transactionId,
            ],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions", "suspicious"],
          });
          console.log("Transaction flagged successfully");
        },
        onError: (error) => {
          console.error("Error flagging transaction:", error);
        },
      }),

    // Add transaction note mutation
    useAddTransactionNote: () =>
      useMutation({
        mutationFn: ({
          transactionId,
          note,
        }: {
          transactionId: string;
          note: string;
        }) => addTransactionNote(transactionId, note),
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({
            queryKey: [
              "admin",
              "transactions",
              "notes",
              variables.transactionId,
            ],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "admin",
              "transactions",
              "details",
              variables.transactionId,
            ],
          });
          console.log("Transaction note added successfully");
        },
        onError: (error) => {
          console.error("Error adding transaction note:", error);
        },
      }),

    // Retry failed transaction mutation
    useRetryFailedTransaction: () =>
      useMutation({
        mutationFn: (transactionId: string) =>
          retryFailedTransaction(transactionId),
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions", "details", variables],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions", "failed"],
          });
          console.log("Transaction retry initiated successfully");
        },
        onError: (error) => {
          console.error("Error retrying transaction:", error);
        },
      }),

    // Bulk transaction action mutation
    useBulkTransactionAction: () =>
      useMutation({
        mutationFn: (action: BulkTransactionAction) =>
          bulkTransactionAction(action),
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["admin", "transactions"],
          });
          console.log(
            `Bulk action completed: ${data.processed} processed, ${data.failed} failed`,
          );
        },
        onError: (error) => {
          console.error("Error performing bulk action:", error);
        },
      }),

    // Export transactions mutation
    useExportTransactions: () =>
      useMutation({
        mutationFn: (params?: TransactionQueryParams) =>
          exportTransactions(params),
        onSuccess: (blob) => {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `transactions-export-${new Date().toISOString().split("T")[0]}.csv`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          console.log("Transactions exported successfully");
        },
        onError: (error) => {
          console.error("Error exporting transactions:", error);
        },
      }),

    // Refresh transactions data
    useRefreshTransactions: () =>
      useMutation({
        mutationFn: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["admin", "transactions"],
          });
          return { success: true };
        },
      }),
  };
}
