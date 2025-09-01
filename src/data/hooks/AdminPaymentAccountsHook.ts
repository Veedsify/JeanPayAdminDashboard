import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllPaymentAccounts,
  createPaymentAccount,
  updatePaymentAccount,
  deletePaymentAccount,
  togglePaymentAccountStatus,
  getPaymentAccountById,
  getActivePaymentAccounts,
  PaymentAccountsQueryParams,
  CreatePaymentAccountRequest,
  UpdatePaymentAccountRequest,
} from "../funcs/adminPaymentAccounts/AdminPaymentAccountsFuncs";

// Infinite query for payment accounts
export function usePaymentAccountsInfiniteQuery(params?: PaymentAccountsQueryParams) {
  return useInfiniteQuery({
    queryKey: ["admin", "payment-accounts", "all", params],
    queryFn: ({ pageParam = 1 }) =>
      getAllPaymentAccounts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.total_pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Regular query for payment accounts
export function usePaymentAccountsQuery(params?: PaymentAccountsQueryParams) {
  return useQuery({
    queryKey: ["admin", "payment-accounts", "paginated", params],
    queryFn: () => getAllPaymentAccounts(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Query for single payment account
export function usePaymentAccountQuery(accountId: number, enabled = true) {
  return useQuery({
    queryKey: ["admin", "payment-accounts", "single", accountId],
    queryFn: () => getPaymentAccountById(accountId),
    enabled: enabled && !!accountId,
    staleTime: 5 * 60 * 1000,
  });
}

// Query for active payment accounts
export function useActivePaymentAccountsQuery(currency?: string, accountType?: string) {
  return useQuery({
    queryKey: ["admin", "payment-accounts", "active", currency, accountType],
    queryFn: () => getActivePaymentAccounts(currency, accountType),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export default function useAdminPaymentAccounts() {
  const queryClient = useQueryClient();

  // Create payment account mutation
  const createPaymentAccountMutation = useMutation({
    mutationFn: async (data: CreatePaymentAccountRequest) => createPaymentAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "payment-accounts"],
      });
    },
    onError: (error) => {
      console.error("Failed to create payment account:", error);
    },
  });

  // Update payment account mutation
  const updatePaymentAccountMutation = useMutation({
    mutationFn: async ({ accountId, data }: { accountId: number; data: UpdatePaymentAccountRequest }) =>
      updatePaymentAccount(accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "payment-accounts"],
      });
    },
    onError: (error) => {
      console.error("Failed to update payment account:", error);
    },
  });

  // Delete payment account mutation
  const deletePaymentAccountMutation = useMutation({
    mutationFn: async (accountId: number) => deletePaymentAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "payment-accounts"],
      });
    },
    onError: (error) => {
      console.error("Failed to delete payment account:", error);
    },
  });

  // Toggle payment account status mutation
  const togglePaymentAccountStatusMutation = useMutation({
    mutationFn: async (accountId: number) => togglePaymentAccountStatus(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "payment-accounts"],
      });
    },
    onError: (error) => {
      console.error("Failed to toggle payment account status:", error);
    },
  });

  // Refresh payment accounts data
  const refreshPaymentAccountsMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "payment-accounts"],
      });
      return { success: true };
    },
  });

  return {
    createPaymentAccount: createPaymentAccountMutation,
    updatePaymentAccount: updatePaymentAccountMutation,
    deletePaymentAccount: deletePaymentAccountMutation,
    togglePaymentAccountStatus: togglePaymentAccountStatusMutation,
    refreshPaymentAccounts: refreshPaymentAccountsMutation,
  };
}
