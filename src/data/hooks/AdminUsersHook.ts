import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
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
} from "../funcs/adminUsers/AdminUsersFuncs";
import {
  UserQueryParams,
  BlockUserRequest,
  UnblockUserRequest,
} from "@/types/admin-users";
import { EditFields } from "@/types/user";

// Custom hooks must start with "use"
export default function useAdminUsers() {
  const queryClient = useQueryClient();

  // Get all users with infinite scroll
  function useUsersInfinite(params?: UserQueryParams) {
    return useInfiniteQuery({
      queryKey: ["admin", "users", "all", params],
      queryFn: ({ pageParam = 1 }) =>
        getAllUsers({ ...params, page: pageParam as number }),
      getNextPageParam: (lastPage) => {
        const { pagination } = lastPage.data;
        return pagination.page < pagination.pages
          ? pagination.page + 1
          : undefined;
      },
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }

  // Get users with regular pagination
  function useUsers(params?: UserQueryParams) {
    return useQuery({
      queryKey: ["admin", "users", "paginated", params],
      queryFn: () => getAllUsers(params),
      staleTime: 5 * 60 * 1000,
    });
  }

  // Get user details
  function useUserDetails(userId: string) {
    return useQuery({
      queryKey: ["admin", "users", "details", userId],
      queryFn: () => getUserDetails(userId),
      enabled: !!userId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  }

  const saveUserDetails = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: EditFields }) =>
      updateUser(userId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users", "details", variables.userId],
      });
    },
  });

  // Get user statistics
  // const userStatsQuery = useQuery({
  //   queryKey: ["admin", "users", "stats"],
  //   queryFn: getUserStats,
  //   staleTime: 10 * 60 * 1000, // 10 minutes
  //   refetchInterval: 15 * 60 * 1000, // 15 minutes
  // });

  // Get user transactions
  function useUserTransactions(
    userId: string,
    params?: { page?: number; limit?: number },
  ) {
    return useQuery({
      queryKey: ["admin", "users", userId, "transactions", params],
      queryFn: () => getUserTransactions(userId, params),
      enabled: !!userId,
      staleTime: 2 * 60 * 1000,
    });
  }

  // Get user wallet
  function useUserWallet(userId: string) {
    return useQuery({
      queryKey: ["admin", "users", userId, "wallet"],
      queryFn: () => getUserWallet(userId),
      enabled: !!userId,
      staleTime: 2 * 60 * 1000,
    });
  }

  // Get user activity logs
  function useUserActivityLogs(userId: string) {
    return useQuery({
      queryKey: ["admin", "users", userId, "activity-logs"],
      queryFn: () => getUserActivityLogs(userId),
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
    });
  }

  // Search users
  function useSearchUsers(query: string) {
    return useQuery({
      queryKey: ["admin", "users", "search", query],
      queryFn: () => searchUsers(query),
      enabled: !!query && query.length >= 2,
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  }

  // Block user mutation
  const blockUserMutation = useMutation({
    mutationFn: (request: BlockUserRequest) => blockUser(request),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "users", "details", variables.userId],
      });
      // Show success notification
      console.log("User blocked successfully");
    },
    onError: (error) => {
      console.error("Error blocking user:", error);
    },
  });

  // Unblock user mutation
  const unblockUserMutation = useMutation({
    mutationFn: (request: UnblockUserRequest) => unblockUser(request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "users", "details", variables.userId],
      });
      console.log("User unblocked successfully");
    },
    onError: (error) => {
      console.error("Error unblocking user:", error);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
      queryClient.removeQueries({
        queryKey: ["admin", "users", "details", variables],
      });
      console.log("User deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  // Verify user mutation
  const verifyUserMutation = useMutation({
    mutationFn: (userId: string) => verifyUser(userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "users", "details", variables],
      });
      console.log("User verified successfully");
    },
    onError: (error) => {
      console.error("Error verifying user:", error);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data: Record<string, unknown>;
    }) => updateUser(userId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "users", "details", variables.userId],
      });
      console.log("User updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  // Export users mutation
  const exportUsersMutation = useMutation({
    mutationFn: (params?: UserQueryParams) => exportUsers(params),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log("Users exported successfully");
    },
    onError: (error) => {
      console.error("Error exporting users:", error);
    },
  });

  // Refresh users data
  const refreshUsersMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
      return { success: true };
    },
  });

  return {
    // Queries
    usersInfinite: useUsersInfinite,
    useUsers: useUsers,
    userDetails: useUserDetails,
    updateUserDetails: saveUserDetails,
    userTransactions: useUserTransactions,
    userWallet: useUserWallet,
    userActivityLogs: useUserActivityLogs,
    searchUsers: useSearchUsers,

    // Mutations
    blockUser: blockUserMutation,
    unblockUser: unblockUserMutation,
    deleteUser: deleteUserMutation,
    verifyUser: verifyUserMutation,
    updateUser: updateUserMutation,
    exportUsers: exportUsersMutation,
    refreshUsers: refreshUsersMutation,

    // Utilities
    isLoadingAny:
      blockUserMutation.isPending ||
      unblockUserMutation.isPending ||
      deleteUserMutation.isPending ||
      verifyUserMutation.isPending ||
      updateUserMutation.isPending,

    isErrorAny:
      blockUserMutation.isError ||
      unblockUserMutation.isError ||
      deleteUserMutation.isError ||
      verifyUserMutation.isError ||
      updateUserMutation.isError,
  };
}
