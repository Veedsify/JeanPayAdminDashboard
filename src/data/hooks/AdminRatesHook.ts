import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getAllRates, getRateHistory, getCurrentRate, addRate } from "../funcs/adminRates/AdminRatesFuncs";
import { ExchangeRate, RateQueryParams } from "@/types/admin-rates";

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
export function useRatesQuery(params?: RateQueryParams) {
  return useQuery({
    queryKey: ["admin", "rates", "paginated", params],
    queryFn: () => getAllRates(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Separate hook for rate history
export function useRateHistoryQuery(params?: RateQueryParams) {
  return useQuery({
    queryKey: ["admin", "rates", "history", params],
    queryFn: () => getRateHistory(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Separate hook for current rate
export function useCurrentRateQuery(fromCurrency: string, toCurrency: string) {
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
    mutationFn: async (data: ExchangeRate) => addRate(data),
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
    refreshRates: refreshRatesMutation,
  };
}
