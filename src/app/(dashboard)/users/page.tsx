"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";

import useAdminUsers from "@/data/hooks/AdminUsersHook";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import useAuth from "@/data/hooks/AuthHook";
import { CreateUserType } from "@/types/user";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

// Mock data to populate the table, based on the provided image.

const UsersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "" | "verified" | "unverified"
  >("");
  const [blockedFilter, setBlockedFilter] = useState<"" | "blocked" | "active">(
    "",
  );
  const { useUsers } = useAdminUsers();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: response,
    isLoading,
    error,
  } = useUsers({
    page: page,
    limit: limit,
    search: debouncedSearch.trim() || undefined,
    status: statusFilter || undefined,
    blocked: blockedFilter || undefined,
  });

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page when search changes
  };

  const handleStatusChange = (newStatus: "" | "verified" | "unverified") => {
    setStatusFilter(newStatus);
    setPage(1); // Reset to first page when status filter changes
  };

  const handleBlockedChange = (newBlocked: "" | "blocked" | "active") => {
    setBlockedFilter(newBlocked);
    setPage(1); // Reset to first page when blocked filter changes
  };

  const toggleNewUserModal = () => {
    setOpenModal((prev) => !prev);
  };
  const clearAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setBlockedFilter("");
    setPage(1);
  };

  return (
    <>
      {/* Main Content Card */}
      <div className="">
        {/* Top Controls: Search, Filters, and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-10 pl-11 pr-4 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value as "" | "verified" | "unverified",
                  )
                }
                className="h-10 px-4 pr-10 bg-white border border-gray-200 rounded-full text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
              >
                <option value="">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={blockedFilter}
                onChange={(e) =>
                  handleBlockedChange(
                    e.target.value as "" | "blocked" | "active",
                  )
                }
                className="h-10 px-4 pr-10 bg-white border border-gray-200 rounded-md text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
              >
                <option value="">All Users</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Active Filters Indicator */}
            {(search || statusFilter || blockedFilter) && (
              <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                <span>Filters active:</span>
                {search && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Search: &ldquo;{search}&rdquo;
                  </span>
                )}
                {statusFilter && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {statusFilter === "verified" ? "Verified" : "Unverified"}
                  </span>
                )}
                {blockedFilter && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    {blockedFilter === "blocked" ? "Blocked" : "Active"}
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
            <Button
              onClick={toggleNewUserModal}
              className="h-10 rounded-full bg-secondary hover:bg-secondary/90 text-white flex-1 md:flex-none cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-1" />
              <span>New User</span>
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto bg-white p-6 rounded-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="p-4 w-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  NGN Balance
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  GHS Balance
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {response?.data?.users?.map((user) => (
                <tr key={user.user.user_id}>
                  <td className="px-4 py-8">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-700">
                    {user.user.id}
                  </td>
                  <td className="p-4 text-sm text-gray-900">
                    <div className="flex items-center gap-3">
                      <Image
                        className="w-8 h-8 rounded-full object-cover"
                        height={32}
                        width={32}
                        src={user.user.profile_picture}
                        alt={user.user.first_name}
                      />
                      <span className="font-medium">
                        {user.user.first_name} {user.user.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {user.user.email}
                  </td>
                  <td className="p-4 text-sm">
                    <div className="inline-block">
                      <span
                        className={`px-2 py-1 text-xs inline-block rounded-full font-medium mr-2 ${
                          user.user.is_verified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.user.is_verified ? "Verified" : "Unverified"}
                      </span>
                      {user.user.is_blocked && (
                        <span className="px-2 py-1 inline-block text-xs rounded-full font-medium bg-red-100 text-red-800">
                          Blocked
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {user.transactionCount}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatCurrency(user.wallet?.balance_ngn || 0, "NGN")}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {formatCurrency(user.wallet?.balance_ghs || 0, "GHS")}
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/users/details/${user.user.id}`}
                      className="h-8 px-4 py-1 text-sm cursor-pointer bg-secondary rounded-full hover:bg-secondary/90 text-white font-semibold"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    {isLoading
                      ? "Loading users..."
                      : error
                        ? "Error loading users. Please try again."
                        : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 md:mb-0">
            <span>Showing</span>
            <div className="relative">
              <select
                onChange={handleLimitChange}
                defaultValue={limit}
                className="appearance-none h-8 pl-3 pr-8 rounded-md border border-gray-200 bg-white focus:outline-none text-gray-800 font-medium"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <span>out of {response?.data?.pagination?.total || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer h-8 w-8 text-gray-500 hover:bg-gray-100"
              disabled={response?.data?.pagination?.page === 1}
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            {[...Array(response?.data?.pagination?.pages || 1)].map(
              (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={
                      response?.data?.pagination?.page === pageNum
                        ? "secondary"
                        : "ghost"
                    }
                    size="sm"
                    className={`rounded-full cursor-pointer h-8 w-8 ${
                      response?.data?.pagination?.page === pageNum
                        ? "bg-primary text-white font-bold hover:bg-[#d0f0ec]"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              },
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer h-8 w-8 text-gray-500 hover:bg-gray-100"
              disabled={
                response?.data?.pagination?.page ===
                response?.data?.pagination?.pages
              }
              onClick={() =>
                handlePageChange(
                  Math.min(page + 1, response?.data?.pagination?.pages || 1),
                )
              }
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {openModal && <NewUserModal onClose={toggleNewUserModal} />}
        </AnimatePresence>
      </div>
    </>
  );
};

const NewUserModal = ({ onClose }: { onClose: () => void }) => {
  const { createUser } = useAuth();

  const [data, setData] = useState<CreateUserType | null>(null);
  const [err, setErr] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setData(
      (prev) =>
        ({
          ...prev,
          [name]: value,
        }) as CreateUserType,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      setErr("");
      createUser.mutate(data, {
        onSuccess: () => {
          toast.success("User created successfully");
          onClose();
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          toast.error(axiosError?.response?.data?.message || error.message);
          setErr(axiosError?.response?.data?.message || error.message);
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold ">Create New User</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="first_name"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="last_name"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div>
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  required
                >
                  <option value="">Select country</option>
                  <option value="NG">Nigeria</option>
                  <option value="GH">Ghana</option>
                </select>
              </div>
            </div>
            {err && err.length > 0 && (
              <p className="text-sm text-red-500">{err}</p>
            )}
            <Button
              type="submit"
              className="mt-6 w-full bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl cursor-pointer"
            >
              Create User
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default UsersPage;
