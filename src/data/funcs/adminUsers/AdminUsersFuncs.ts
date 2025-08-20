import axiosClient from "@/lib/axios";
import {
  UsersApiResponse,
  UserDetailsApiResponse,
  // UserStatsApiResponse,
  UserActionApiResponse,
  UserQueryParams,
  BlockUserRequest,
  UnblockUserRequest,
} from "@/types/admin-users";
import { EditFields } from "@/types/user";

// Get all users with pagination and filters
async function getAllUsers(
  params?: UserQueryParams,
): Promise<UsersApiResponse> {
  const request = await axiosClient.post("/admin/users/all", params);
  return request.data;
}

// Get user details by ID
async function getUserDetails(userId: string): Promise<UserDetailsApiResponse> {
  const response = await axiosClient.post(`/admin/users/details/${userId}`);
  return response.data;
}

// Get user statistics
// async function getUserStats(): Promise<UserStatsApiResponse> {
//   return axiosClient.get("/admin/users/stats");
// }

// Block a user
async function blockUser(
  request: BlockUserRequest,
): Promise<UserActionApiResponse> {
  return axiosClient.patch(`/admin/users/block/${request.userId}`, {
    reason: request.reason,
  });
}

// Unblock a user
async function unblockUser(
  request: UnblockUserRequest,
): Promise<UserActionApiResponse> {
  const response = await axiosClient.patch(
    `/admin/users/unblock/${request.userId}`,
  );
  return response.data;
}

// Delete a user
async function deleteUser(userId: string): Promise<UserActionApiResponse> {
  return axiosClient.delete(`/admin/users/delete/${userId}`);
}

// Verify a user account
async function verifyUser(userId: string): Promise<UserActionApiResponse> {
  return axiosClient.patch(`/admin/users/verify/${userId}`);
}

// Get user transactions
async function getUserTransactions(userId: string) {
  return axiosClient.get(`/admin/users/${userId}/transactions`);
}

// Get user wallet details
async function getUserWallet(userId: string) {
  return axiosClient.get(`/admin/users/${userId}/wallet`);
}

// Update user information
async function updateUser(
  userId: number,
  data: EditFields,
): Promise<UserActionApiResponse> {
  return axiosClient.patch(`/admin/users/update/${userId}`, data);
}

// Search users
async function searchUsers(query: string): Promise<UsersApiResponse> {
  return axiosClient.post("/admin/users/search", { query });
}

// Export user data
async function exportUsers(params?: UserQueryParams): Promise<Blob> {
  const response = await axiosClient.post("/admin/users/export", params, {
    responseType: "blob",
  });
  return response.data;
}

// Get user activity logs
async function getUserActivityLogs(userId: string) {
  return axiosClient.get(`/admin/users/${userId}/activity-logs`);
}

export {
  getAllUsers,
  getUserDetails,
  // getUserStats,
  blockUser,
  unblockUser,
  deleteUser,
  verifyUser,
  getUserTransactions,
  getUserWallet,
  updateUser,
  searchUsers,
  exportUsers,
  getUserActivityLogs,
};
