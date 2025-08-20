"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, MoreVertical, Check, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useAdminTransactions from "@/data/hooks/AdminTransactionsHook";
import {
  Transaction,
  TransactionDetails as TransactionDetailsType,
  UserBasicInfo,
} from "@/types/admin-transactions";
import { GetCurrencySymbol, getStatusColor } from "@/lib/utils";
import Image from "next/image";

const TransactionDetails = () => {
  const params = useParams();
  const transactionId = params.id as string;

  const { useTransactionDetails, useApproveTransaction, useRejectTransaction } =
    useAdminTransactions();
  const {
    data: transactionData,
    isLoading,
    error,
  } = useTransactionDetails(transactionId);
  const approveTransactionMutation = useApproveTransaction();
  const rejectTransactionMutation = useRejectTransaction();

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const transaction = transactionData?.data;

  const handleApprove = async () => {
    if (!transaction) return;

    setIsApproving(true);
    try {
      await approveTransactionMutation.mutateAsync({
        transactionId: transaction.transaction.transaction_id,
        adminNotes: adminNotes.trim() || undefined,
      });
      // Transaction will be updated via query invalidation
    } catch (error) {
      console.error("Failed to approve transaction:", error);
    } finally {
      setIsApproving(false);
      setAdminNotes("");
    }
  };

  const handleReject = async () => {
    if (!transaction || !rejectReason.trim()) return;

    setIsRejecting(true);
    try {
      await rejectTransactionMutation.mutateAsync({
        transactionId: transaction.transaction.transaction_id,
        reason: rejectReason.trim(),
        adminNotes: adminNotes.trim() || undefined,
      });
      // Transaction will be updated via query invalidation
    } catch (error) {
      console.error("Failed to reject transaction:", error);
    } finally {
      setIsRejecting(false);
      setRejectReason("");
      setAdminNotes("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getStatusDisplay = (status: string) => {
    switch (status?.toUpperCase()) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getUserInitials = (user?: UserBasicInfo) => {
    if (user?.profile_picture) {
      return (
        <Image
          src={user.profile_picture}
          alt={`${user.first_name || ""} ${user.last_name || ""}`}
          width={96}
          height={96}
          className="rounded-full object-cover aspect-square"
        />
      );
    }
    if (!user) return "??";
    return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();
  };

  const getUserFullName = (user?: UserBasicInfo) => {
    if (!user) return "Unknown User";
    return `${user.first_name || ""} ${user.last_name || ""}`.trim();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-lg font-semibold mb-2">
          {error ? "Error loading transaction" : "Transaction not found"}
        </div>
        <Link
          href="/transactions"
          className="text-primary hover:underline flex items-center"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Transactions
        </Link>
      </div>
    );
  }

  const getReceiverDetails = (
    details: TransactionDetailsType,
    transaction: Transaction,
  ) => {
    if (!details || !transaction) return null;
    if (
      transaction.payment_type !== "bank" &&
      transaction.payment_type !== "momo"
    ) {
      return null;
    }
    if (transaction.transaction_type === "deposit") return null;
    return (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">Receiver Details</p>
        {transaction.payment_type === "bank" && (
          <div className="mt-2 space-y-2">
            <p className="font-semibold">{details.recipient_name}</p>
            <p className="text-sm text-gray-600">
              {details.account_number || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              {details.bank_name || "N/A"}
            </p>
          </div>
        )}

        {transaction.payment_type === "momo" && (
          <div className="mt-2 space-y-2">
            <p className="font-semibold">{details.recipient_name}</p>
            <p className="text-sm text-gray-600">
              {details.phone_number || "N/A"}
            </p>
            <p className="text-sm text-gray-600">{details.network || "N/A"}</p>
          </div>
        )}
      </div>
    );
  };

  const canModifyTransaction = transaction.transaction.status === "pending";

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Link
          href="/transactions"
          className="text-secondary font-bold flex items-center hover:underline"
        >
          <ArrowLeftIcon className="mr-2" />
          Back to Transactions
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Transaction Information */}
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Transaction Information
              </h2>
              {canModifyTransaction && (
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleReject}
                    disabled={
                      isRejecting || isApproving || !rejectReason.trim()
                    }
                    variant="ghost"
                    className="px-6 py-2 h-auto bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {isRejecting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Rejecting...
                      </div>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    variant="ghost"
                    className="px-6 py-2 h-auto bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {isApproving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Approving...
                      </div>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-semibold">
                  {transaction.transaction.transaction_id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference</p>
                <p className="font-semibold">
                  {transaction.transaction.reference}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-semibold">
                  {transaction.transaction_details &&
                  transaction.transaction_details.from_currency
                    ? formatAmount(
                        transaction.transaction_details.from_amount,
                        GetCurrencySymbol(
                          transaction.transaction_details.from_currency,
                        ),
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-semibold">
                  {transaction.transaction.payment_type || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Direction</p>
                <p className="font-semibold">
                  {transaction.transaction.direction || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-semibold">
                  {transaction.transaction.transaction_type}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Created</p>
                <p className="font-semibold">
                  {formatDate(transaction.transaction.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.transaction.status)}`}
                  >
                    {getStatusDisplay(transaction.transaction.status)}
                  </span>
                </div>
              </div>
            </div>

            {transaction.transaction.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-semibold mt-1">
                  {transaction.transaction.description}
                </p>
              </div>
            )}
            {getReceiverDetails(
              transaction.transaction_details,
              transaction.transaction,
            )}
          </div>

          {/* Admin Actions */}
          {canModifyTransaction && (
            <div className="bg-white p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Admin Actions
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any administrative notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (Required for rejection)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Transaction Timeline
              </h2>
              <button className="text-gray-400">
                <MoreVertical className="h-6 w-6" />
              </button>
            </div>
            <div className="relative pl-4">
              <div className="absolute left-6 top-2 bottom-4 w-0.5 bg-gray-200"></div>

              <div className="relative mb-8">
                <div className="absolute -left-1.5 top-0.5 flex items-center justify-center w-8 h-8">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-8">
                  <p className="font-semibold">Transaction Submitted</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.transaction.created_at)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Transaction initiated by user
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-1.5 top-0.5 flex items-center justify-center w-8 h-8">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      transaction.transaction.status === "pending"
                        ? "bg-yellow-100"
                        : transaction.transaction.status === "completed"
                          ? "bg-green-100"
                          : "bg-red-100"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        transaction.transaction.status === "pending"
                          ? "bg-yellow-400"
                          : transaction.transaction.status === "completed"
                            ? "bg-green-400"
                            : "bg-red-400"
                      }`}
                    ></div>
                  </div>
                </div>
                <div className="ml-8">
                  <p className="font-semibold">
                    Current Status:{" "}
                    {getStatusDisplay(transaction.transaction.status)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(
                      transaction.transaction.updated_at ??
                        transaction.transaction.created_at,
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {transaction.transaction.status === "pending" &&
                      "Awaiting admin review"}
                    {transaction.transaction.status === "completed" &&
                      "Transaction completed successfully"}
                    {transaction.transaction.status === "failed" &&
                      "Transaction failed"}
                    {transaction.transaction.status === "cancelled" &&
                      "Transaction was cancelled"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-primary rounded-full mb-4 flex items-center justify-center text-white font-bold text-2xl">
                {getUserInitials(transaction?.user)}
              </div>
              <h3 className="text-xl font-bold">
                {getUserFullName(transaction?.user)}
              </h3>
              <p className="text-gray-500">
                @{transaction.user?.email?.split("@")[0] || "user"}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  User Information
                </h2>
                <button className="text-gray-400">
                  <MoreVertical className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">USER ID</p>
                  <p className="font-semibold">{transaction.user.user_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">EMAIL</p>
                  <p className="font-semibold">
                    {transaction.user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">PHONE</p>
                  <p className="font-semibold">
                    {transaction.user?.phone_number || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">FIRST NAME</p>
                  <p className="font-semibold">
                    {transaction.user?.first_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">LAST NAME</p>
                  <p className="font-semibold">
                    {transaction.user?.last_name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;
