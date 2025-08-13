"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AccountBalanceCard from "@/components/users/AccountBalanceCard";
import AccountDetailsCard from "@/components/users/AccountDetailsCard";
import TransactionHistoryCard from "@/components/users/TransactionHistoryCard";
import UserCard from "@/components/users/UserCard";
import UserInfoCard from "@/components/users/UserInfoCard";
import { users } from "@/data/users";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const UserDetailsPage = () => {
  const params = useParams();

  const user = users.find((user) => user.id === params.id);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 rounded-2xl min-h-full">
        <div
          className="
          flex justify-between items-center mb-4
        "
        >
          <Link
            href="/users"
            className="text-secondary font-bold flex items-center hover:underline"
          >
            <ArrowLeftIcon className="mr-2" />
            Back to Users
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <UserInfoCard user={user} />
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-2 space-y-6">
            <AccountBalanceCard />
            <AccountDetailsCard />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-full xl:col-span-1 space-y-6">
            <UserCard />
            <TransactionHistoryCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDetailsPage;
