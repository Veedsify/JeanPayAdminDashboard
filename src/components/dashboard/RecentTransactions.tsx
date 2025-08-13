"use client";

import { useDashboardStore } from "@/store/dashboard";
import { formatDate, formatTime } from "@/lib/utils";

export function RecentTransactions() {
  const recentTransactions = useDashboardStore(
    (state) => state.recentTransactions,
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            In Progress
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
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
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.patient}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.patientId}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="text-sm text-gray-900">
                      {transaction.treatment}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.doctor}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(transaction.time)}
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
