import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDashboardStats,
  getDashboardOverview,
  getDashboardMetrics,
  getDashboardRealtime,
} from "../funcs/adminDashboard/AdminDashboardFuncs";
import {
  DashboardStatsParams,
} from "@/types/admin-dashboard";

export default function useAdminDashboard() {
  const queryClient = useQueryClient();

  // Get dashboard statistics
  const dashboardStatsQuery = useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: getAdminDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  // Get dashboard overview with date filters
  const getDashboardOverviewQuery = (params?: DashboardStatsParams) =>
    useQuery({
      queryKey: ["admin", "dashboard", "overview", params],
      queryFn: () => getDashboardOverview(params),
      enabled: !!params,
      staleTime: 5 * 60 * 1000,
    });

  // Get dashboard metrics
  const getDashboardMetricsQuery = (params: DashboardStatsParams) =>
    useQuery({
      queryKey: ["admin", "dashboard", "metrics", params],
      queryFn: () => getDashboardMetrics(params),
      enabled: !!(params.from_date && params.to_date),
      staleTime: 5 * 60 * 1000,
    });

  // Get real-time dashboard data
  const dashboardRealtimeQuery = useQuery({
    queryKey: ["admin", "dashboard", "realtime"],
    queryFn: getDashboardRealtime,
    refetchInterval: 30 * 1000, // 30 seconds
    staleTime: 30 * 1000,
  });

  // Refresh dashboard data
  const refreshDashboardMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
      return { success: true };
    },
  });

  return {
    // Queries
    dashboardStats: dashboardStatsQuery,
    getDashboardOverview: getDashboardOverviewQuery,
    getDashboardMetrics: getDashboardMetricsQuery,
    dashboardRealtime: dashboardRealtimeQuery,

    // Mutations
    refreshDashboard: refreshDashboardMutation,

    // Utilities
    isLoading: dashboardStatsQuery.isLoading || dashboardRealtimeQuery.isLoading,
    isError: dashboardStatsQuery.isError || dashboardRealtimeQuery.isError,
    error: dashboardStatsQuery.error || dashboardRealtimeQuery.error,
  };
}
