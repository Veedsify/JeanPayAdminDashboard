"use client";

import { CircleDollarSign, MoreHorizontal } from "lucide-react";
import React from "react";

const AccountBalanceCard = () => {
  const balances = {
    ngn: {
      amount: "3,927,002",
      currency: "NGN",
    },
    ghs: {
      amount: "7,899",
      currency: "GHS",
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800">Account Balance</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* NGN Balance */}
        <div className="bg-[#F97316] text-white p-4 rounded-xl flex flex-col justify-between min-h-[120px]">
          <div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-white/25 p-1.5 rounded-full">
                <CircleDollarSign size={16} />
              </div>
              <span>NGN Balance</span>
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">
            {balances.ngn.amount}{" "}
            <span className="text-sm font-medium">{balances.ngn.currency}</span>
          </p>
        </div>

        {/* GHS Balance */}
        <div className="bg-[#005B58] text-white p-4 rounded-xl flex flex-col justify-between min-h-[120px]">
          <div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-white/25 p-1.5 rounded-full">
                <CircleDollarSign size={16} />
              </div>
              <span>GHS Balance</span>
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">
            {balances.ghs.amount}{" "}
            <span className="text-sm font-medium">{balances.ghs.currency}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountBalanceCard;
