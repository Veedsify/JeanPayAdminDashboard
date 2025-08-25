import axiosClient from "@/lib/axios";
import {
  DashboardApiResponse,
  DashboardStatsApiResponse,
  DashboardStatsParams,
} from "@/types/admin-dashboard";

// Get admin dashboard statistics
async function getAdminDashboardStats(): Promise<DashboardApiResponse> {
  const response = await axiosClient.post("/admin/dashboard");
  return response.data;
}

// Get dashboard overview with date filters
async function getDashboardOverview(
  params?: DashboardStatsParams,
): Promise<DashboardStatsApiResponse> {
  const response = await axiosClient.post("/admin/dashboard/overview", params);
  return response.data;
}

// Get dashboard metrics for specific date range
async function getDashboardMetrics(
  params: DashboardStatsParams,
): Promise<DashboardStatsApiResponse> {
  const response = await axiosClient.post("/admin/dashboard/metrics", params);
  return response.data;
}

// Get real-time dashboard data
async function getDashboardRealtime(): Promise<DashboardApiResponse> {
  const response = await axiosClient.get("/admin/dashboard/realtime");
  return response.data;
}

export {
  getAdminDashboardStats,
  getDashboardOverview,
  getDashboardMetrics,
  getDashboardRealtime,
};
