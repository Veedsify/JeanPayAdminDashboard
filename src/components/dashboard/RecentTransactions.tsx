"use client";

import { formatDate, formatTime } from "@/lib/utils";
import { TransactionWithUser } from "@/types/admin-dashboard";

interface RecentTransactionsProps {
  transactions: TransactionWithUser[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h3>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Users
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Transactions
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Date & Time
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.user
                        ? `${transaction.user.first_name} ${transaction.user.last_name}`
                        : "Unknown User"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.user?.email || "No email"}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="text-sm text-gray-900">
                      {transaction.amount.toLocaleString()}{" "}
                      {transaction.currency}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.transaction_type} - {transaction.direction}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="text-sm text-gray-900">
                      {formatDate(transaction.created_at)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(transaction.created_at)}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(transaction.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
