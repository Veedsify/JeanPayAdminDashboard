"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CreditCard,
  Smartphone,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { usePaymentAccountsInfiniteQuery } from "@/data/hooks/AdminPaymentAccountsHook";
import useAdminPaymentAccounts from "@/data/hooks/AdminPaymentAccountsHook";
import {
  PaymentAccount,
  CreatePaymentAccountRequest,
  UpdatePaymentAccountRequest,
} from "@/data/funcs/adminPaymentAccounts/AdminPaymentAccountsFuncs";
import { debounce } from "lodash";
import { Button } from "@/components/ui/Button";
import { form } from "framer-motion/m";

// Input Component
const Input = React.memo(
  ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
      <input
        className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// Select Component
const Select = React.memo(
  ({
    className,
    children,
    ...props
  }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
    return (
      <select
        className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

// Status Badge Component
const StatusBadge = React.memo(({ isActive }: { isActive: boolean }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isActive ? (
        <>
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </>
      )}
    </span>
  );
});
StatusBadge.displayName = "StatusBadge";

// Loading Skeleton Component
const LoadingSkeleton = React.memo(() => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
  </div>
));
LoadingSkeleton.displayName = "LoadingSkeleton";

// Empty State Component
const EmptyState = React.memo(() => (
  <div className="text-center py-12">
    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      No payment accounts
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Get started by creating a new payment account.
    </p>
  </div>
));
EmptyState.displayName = "EmptyState";

// Currency and Account Type Options
const CURRENCIES = [
  { value: "", label: "All Currencies" },
  { value: "NGN", label: "Nigerian Naira (NGN)" },
  { value: "GHS", label: "Ghanaian Cedis (GHS)" },
];

const ACCOUNT_TYPES = [
  { value: "", label: "All Types" },
  { value: "bank", label: "Bank Account" },
  { value: "momo", label: "Mobile Money" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

// Payment Account Modal Component
const PaymentAccountModal = React.memo(
  ({
    isOpen,
    onClose,
    account,
    onSubmit,
  }: {
    isOpen: boolean;
    onClose: () => void;
    account?: PaymentAccount;
    onSubmit: (
      data: CreatePaymentAccountRequest | UpdatePaymentAccountRequest,
    ) => void;
  }) => {
    const [formData, setFormData] = useState<
      CreatePaymentAccountRequest | UpdatePaymentAccountRequest
    >({
      currency: "NGN",
      account_type: "bank",
      account_name: "",
      account_number: "",
      bank_name: "",
      bank_code: "",
      phone_number: "",
      network: "",
      notes: "",
    });

    useEffect(() => {
      if (account) {
        setFormData({
          currency: account?.currency ?? "NGN",
          account_type: account?.account_type ?? "bank",
          account_name: account?.account_name ?? "",
          account_number: account?.account_number ?? "",
          bank_name: account?.bank_name ?? "",
          bank_code: account?.bank_code ?? "",
          phone_number: account?.phone_number ?? "",
          network: account?.network ?? "",
          notes: account?.notes ?? "",
        });
      }
    }, [account]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-150 text-2xl font-bold focus:outline-none"
            aria-label="Close modal"
          >
            ×
          </button>
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-6 h-6 text-secondary" />
            <h2 className="text-xl font-bold text-gray-900">
              {account ? "Edit Payment Account" : "Add New Payment Account"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="w-full"
                >
                  <option value="NGN">Nigerian Naira (NGN)</option>
                  <option value="GHS">Ghanaian Cedis (GHS)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <Select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleChange}
                  required
                  className="w-full"
                >
                  <option value="bank">Bank Account</option>
                  <option value="momo">Mobile Money</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                placeholder="Enter account holder name"
                required
                className="w-full"
              />
            </div>

            {formData.account_type === "bank" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    placeholder="Enter account number"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bank Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="bank_code"
                    value={formData.bank_code}
                    onChange={handleChange}
                    placeholder="Enter bank code"
                    required
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {formData.account_type === "momo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Network <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="network"
                    value={formData.network}
                    onChange={handleChange}
                    placeholder="Enter network provider"
                    required
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter additional notes"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-colors duration-150 font-semibold shadow"
              >
                {account ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  },
);
PaymentAccountModal.displayName = "PaymentAccountModal";

// Main Component
export default function PaymentAccountsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<
    PaymentAccount | undefined
  >();
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("");
  const [accountType, setAccountType] = useState("");
  const [status, setStatus] = useState("");

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaymentAccountsInfiniteQuery({
    search,
    currency: currency || undefined,
    account_type: accountType || undefined,
    is_active: status ? status === "true" : undefined,
  });

  const {
    createPaymentAccount,
    updatePaymentAccount,
    deletePaymentAccount,
    togglePaymentAccountStatus,
  } = useAdminPaymentAccounts();

  const debouncedSearchChange = useMemo(
    () => debounce((value: string) => setSearch(value), 300),
    [],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearchChange(e.target.value);
    },
    [debouncedSearchChange],
  );

  const handleAddAccount = useCallback(() => {
    setEditingAccount(undefined);
    setModalOpen(true);
  }, []);

  const handleEditAccount = useCallback((account: PaymentAccount) => {
    setEditingAccount(account);
    setModalOpen(true);
  }, []);

  const handleDeleteAccount = useCallback(
    async (accountId: number) => {
      if (
        window.confirm("Are you sure you want to delete this payment account?")
      ) {
        try {
          await deletePaymentAccount.mutateAsync(accountId);
        } catch (error) {
          console.error("Failed to delete payment account:", error);
        }
      }
    },
    [deletePaymentAccount],
  );

  const handleToggleStatus = useCallback(
    async (accountId: number) => {
      try {
        await togglePaymentAccountStatus.mutateAsync(accountId);
      } catch (error) {
        console.error("Failed to toggle account status:", error);
      }
    },
    [togglePaymentAccountStatus],
  );

  const handleModalSubmit = useCallback(
    async (data: CreatePaymentAccountRequest | UpdatePaymentAccountRequest) => {
      try {
        if (editingAccount) {
          await updatePaymentAccount.mutateAsync({
            accountId: editingAccount.ID,
            data: data as UpdatePaymentAccountRequest,
          });
        } else {
          await createPaymentAccount.mutateAsync(
            data as CreatePaymentAccountRequest,
          );
        }
        setModalOpen(false);
        setEditingAccount(undefined);
      } catch (error) {
        console.error("Failed to save payment account:", error);
      }
    },
    [editingAccount, createPaymentAccount, updatePaymentAccount],
  );

  const accounts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading payment accounts
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Please try refreshing the page or contact support if the
                  problem persists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Accounts</h1>
          <p className="text-gray-600">
            Manage payment accounts used for customer top-ups
          </p>
        </div>
        <Button
          onClick={handleAddAccount}
          className="bg-secondary rounded-full text-white px-4 py-2 hover:bg-secondary/80 cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search accounts..."
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <Select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              {ACCOUNT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Payment Accounts List */}
      <div className="bg-white rounded-xl">
        {isLoading ? (
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl">
              <thead className="bg-white overflow-hidden">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Details
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Currency
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account.ID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {account.account_type === "bank" ? (
                          <CreditCard className="h-8 w-8 text-gray-400 mr-3" />
                        ) : (
                          <Smartphone className="h-8 w-8 text-gray-400 mr-3" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {account.account_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.account_type === "bank"
                              ? `${account.bank_name} - ${account.account_number}`
                              : `${account.network} - ${account.phone_number}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {account.account_type === "bank"
                          ? "Bank Account"
                          : "Mobile Money"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {account.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge isActive={account.is_active} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(account.CreatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleToggleStatus(account.ID)}
                          className="text-blue-600 hover:text-blue-900"
                          title={account.is_active ? "Deactivate" : "Activate"}
                        >
                          {account.is_active ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.ID)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && (
          <div className="p-4 text-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <PaymentAccountModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAccount(undefined);
        }}
        account={editingAccount}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
