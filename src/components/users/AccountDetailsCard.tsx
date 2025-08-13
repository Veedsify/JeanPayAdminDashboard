"use client";

import { MoreHorizontal, Phone, Home, User } from "lucide-react";
import React from "react";

const AccountDetailsCard = () => {
  const accountDetails = {
    ngn: "8899 3388 2299 8989",
    ghs: "2234 3288 2233 2299",
    payId: "@maurice",
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800">Account Details</h3>
      </div>
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Phone size={20} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">NGN Details</p>
            <p className="font-medium text-gray-800">{accountDetails.ngn}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Home size={20} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">GHS Details</p>
            <p className="font-medium text-gray-800">{accountDetails.ghs}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <User size={20} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Pay ID</p>
            <p className="font-medium text-gray-800">{accountDetails.payId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsCard;
