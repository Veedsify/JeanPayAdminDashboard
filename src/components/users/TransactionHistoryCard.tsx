import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import React from "react";
import { getStatusColor } from "@/lib/utils";

type RecentTransactions = {
  id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  createdAt: string;
};

const TransactionHistoryCard = ({
  transactions,
  transactionCount,
}: {
  transactions: RecentTransactions[];
  transactionCount: number;
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800">
          Transaction History ({transactionCount})
        </h3>
      </div>
      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <div key={index} className="bg-[#F7FBF6] p-4 rounded-xl">
            <div className="mb-2">
              <span
                className={cn(
                  getStatusColor(tx.status),
                  `text-xs font-medium px-2 py-1 rounded-md`
                )}
              >
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </span>
            </div>
            <p className="font-semibold text-gray-800 text-sm mb-2">
              {tx.description}
            </p>
            <div className="flex items-center text-xs text-gray-500 space-x-1.5">
              <Calendar size={14} />
              <span>{tx.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistoryCard;
