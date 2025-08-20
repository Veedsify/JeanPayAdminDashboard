"use client";

import { formatIntoSpace } from "@/lib/textformat";
import { WalletDetailsPage } from "@/types/admin-users";
import { Phone, Home, User } from "lucide-react";
import React from "react";
interface User {
  name: string;
  username: string;
  email: string;
  profile_image: string;
  id: number;
  phone: string;
}
type AccountDetailsCardProp = {
  wallet: Partial<WalletDetailsPage> | null;
  user: User | null;
};

const AccountDetailsCard = ({ wallet, user }: AccountDetailsCardProp) => {
  if (!wallet?.wallet_id_ghs || !wallet?.wallet_id_ngn || !user) {
    return <div className="text-gray-500">No account details available</div>;
  }
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
            <p className="font-medium text-gray-800">
              {formatIntoSpace(wallet?.wallet_id_ngn, 4, " ")}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Home size={20} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">GHS Details</p>
            <p className="font-medium text-gray-800">
              {formatIntoSpace(wallet?.wallet_id_ghs, 4, " ")}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <User size={20} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Pay ID</p>
            <p className="font-medium text-gray-800">{user?.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsCard;
