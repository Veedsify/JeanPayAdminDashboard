import { Calendar, MoreHorizontal } from "lucide-react";
import React from "react";

const TransactionHistoryCard = () => {
  const transactions = [
    {
      status: "Completed",
      description: "NGN 40,000 to GHS 5,000",
      date: "2028/06/15 - 1:00 PM",
    },
    {
      status: "Completed",
      description: "GHS 445 to NGN 8,902",
      date: "2028/08/03 - 1:25 PM",
    },
    {
      status: "Completed",
      description: "NGN 44,568 to GHS 9906",
      date: "2028/08/03 - 1:25 PM",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800">Transaction History</h3>
      </div>
      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <div key={index} className="bg-[#F7FBF6] p-4 rounded-xl">
            <div className="mb-2">
              <span className="bg-[#EBF9EB] text-green-700 text-xs font-medium px-2 py-1 rounded-md">
                {tx.status}
              </span>
            </div>
            <p className="font-semibold text-gray-800 text-sm mb-2">
              {tx.description}
            </p>
            <div className="flex items-center text-xs text-gray-500 space-x-1.5">
              <Calendar size={14} />
              <span>{tx.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistoryCard;
