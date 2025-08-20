import axiosClient from "@/lib/axios";
import {
  DashboardApiResponse,
  DashboardStatsApiResponse,
  DashboardStatsParams,
} from "@/types/admin-dashboard";

// Get admin dashboard statistics
async function getAdminDashboardStats(): Promise<DashboardApiResponse> {
  return axiosClient.post("/admin/dashboard");
}

// Get dashboard overview with date filters
async function getDashboardOverview(
  params?: DashboardStatsParams
): Promise<DashboardStatsApiResponse> {
  return axiosClient.post("/admin/dashboard/overview", params);
}

// Get dashboard metrics for specific date range
async function getDashboardMetrics(
  params: DashboardStatsParams
): Promise<DashboardStatsApiResponse> {
  return axiosClient.post("/admin/dashboard/metrics", params);
}

// Get real-time dashboard data
async function getDashboardRealtime(): Promise<DashboardApiResponse> {
  return axiosClient.get("/admin/dashboard/realtime");
}

export {
  getAdminDashboardStats,
  getDashboardOverview,
  getDashboardMetrics,
  getDashboardRealtime,
};
