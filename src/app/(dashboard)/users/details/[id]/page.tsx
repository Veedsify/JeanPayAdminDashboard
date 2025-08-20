"use client";
import AccountBalanceCard from "@/components/users/AccountBalanceCard";
import AccountDetailsCard from "@/components/users/AccountDetailsCard";
import TransactionHistoryCard from "@/components/users/TransactionHistoryCard";
import UserCard from "@/components/users/UserCard";
import UserInfoCard from "@/components/users/UserInfoCard";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import useAdminUsers from "@/data/hooks/AdminUsersHook";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { userDetails } = useAdminUsers();
  const { data: response, isLoading, isError } = userDetails(id);

  const mappedUser = useMemo(() => {
    const user = response?.data?.user;
    if (!user) return null;
    return {
      name: `${user.first_name} ${user.last_name}`.trim(),
      username: user.username,
      email: user.email,
      id: user.id,
      profile_image: user.profile_picture,
      phone: user.phone_number,
      is_blocked: user.is_blocked,
      is_verified: user.is_verified,
    };
  }, [response?.data?.user]);

  const mappedRecentTransactions = useMemo(() => {
    if (!response?.data?.recentTransactions) return [];
    return response?.data?.recentTransactions.map((transaction) => ({
      id: transaction.transaction_id,
      amount: transaction.amount,
      description: transaction.description,
      type: transaction.transaction_type,
      status: transaction.status,
      createdAt: transaction.created_at,
    }));
  }, [response?.data?.recentTransactions]);

  const wallet = response?.data?.wallet || null;

  if (isLoading) {
    return (
      <div className=" bg-white p-2 md:p-8 rounded-2xl shadow-md">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError && !isLoading) {
    return (
      <div className="text-red-500 bg-white p-2 md:p-8 rounded-2xl shadow-md">
        Error loading user details
      </div>
    );
  }

  return (
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
          <UserInfoCard user={mappedUser} isLoading={isLoading} />
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-2 space-y-6">
          <AccountBalanceCard wallet={wallet} />
          <AccountDetailsCard user={mappedUser} wallet={wallet} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-full xl:col-span-1 space-y-6">
          <UserCard name={mappedUser?.name} />
          <TransactionHistoryCard
            transactions={mappedRecentTransactions}
            transactionCount={response?.data.transactionCount || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
