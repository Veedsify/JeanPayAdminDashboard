import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllRates,
  getRateHistory,
  getCurrentRate,
  addRate as addRateFunc,
  updateRate as updateRateFunc,
  deleteRate as deleteRateFunc,
  toggleRateStatus as toggleRateStatusFunc,
} from "../funcs/adminRates/AdminRatesFuncs";
import {
  ExchangeRate,
  RateQueryParams,
  UpdateRateRequest,
} from "@/types/admin-rates";

// Separate hook for infinite rates query
export function useRatesInfiniteQuery(params?: RateQueryParams) {
  return useInfiniteQuery({
    queryKey: ["admin", "rates", "all", params],
    queryFn: ({ pageParam = 0 }) =>
      getAllRates({ ...params, cursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor) {
        return lastPage.nextCursor;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Separate hook for regular rates query
function useRatesQuery(params?: RateQueryParams) {
  return useQuery({
    queryKey: ["admin", "rates", "paginated", params],
    queryFn: () => getAllRates(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Separate hook for rate history
function useRateHistoryQuery(params?: RateQueryParams) {
  return useQuery({
    queryKey: ["admin", "rates", "history", params],
    queryFn: () => getRateHistory(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Separate hook for current rate
function useCurrentRateQuery(fromCurrency: string, toCurrency: string) {
  return useQuery({
    queryKey: ["admin", "rates", "current", fromCurrency, toCurrency],
    queryFn: () => getCurrentRate(fromCurrency, toCurrency),
    enabled: !!(fromCurrency && toCurrency),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });
}

export default function useAdminRates() {
  const queryClient = useQueryClient();

  // Add new rate
  const addRateMutation = useMutation({
    mutationFn: async (data: ExchangeRate) => addRateFunc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "rates"],
      });
    },
  });

  // Update rate
  const updateRateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRateRequest }) =>
      updateRateFunc(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "rates"],
      });
    },
  });

  // Delete rate
  const deleteRateMutation = useMutation({
    mutationFn: async (id: number) => deleteRateFunc(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "rates"],
      });
    },
  });

  // Toggle rate status
  const toggleRateStatusMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) =>
      toggleRateStatusFunc(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "rates"],
      });
    },
  });

  // Refresh rates data
  const refreshRatesMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "rates"],
      });
      return { success: true };
    },
  });

  return {
    addRate: addRateMutation,
    updateRate: updateRateMutation,
    deleteRate: deleteRateMutation,
    toggleRateStatus: toggleRateStatusMutation,
    refreshRates: refreshRatesMutation,
  };
}
