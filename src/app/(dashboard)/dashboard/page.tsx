"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UsersByGenderChart } from "@/components/dashboard/UsersByGenderChart";
import { TransactionOverview } from "@/components/dashboard/TransactionOverview";
import { UserTransactions } from "@/components/dashboard/UserTransactions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import useAdminDashboard from "@/data/hooks/AdminDashboardHook";
import { Users, CreditCard, UserPlus } from "lucide-react";

export default function Dashboard() {
  const { dashboardStats, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (isError || !dashboardStats.data) {
    return (
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 flex items-center justify-center h-64">
          <div className="text-lg text-red-500">
            Failed to load dashboard data
          </div>
        </div>
      </div>
    );
  }

  const { summary, monthlyVolume, recentTransactions } =
    dashboardStats.data.data;

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 col-span-full md:col-span-4 lg:col-span-3 gap-4">
        <StatsCard
          title="Users"
          value={summary.totalUsers.toLocaleString()}
          icon={Users}
          variant="cyan"
          className="col-span-full md:col-span-1"
        />
        <StatsCard
          title="Total Transactions"
          value={summary.totalTransactions.toLocaleString()}
          icon={CreditCard}
          variant="cyan"
          className="col-span-full md:col-span-1"
        />
        <div className="grid grid-cols-1 lg:grid-cols-4 col-span-2">
          <div className="col-span-full grid gap-4">
            <StatsCard
              title="Pending Transactions"
              value={summary.pendingTransactions.toLocaleString()}
              icon={UserPlus}
              variant="orange"
              className="md:col-span-2 lg:col-span-4"
            />
            <div className="md:col-span-2 lg:col-span-4">
              <RevenueChart monthlyVolume={monthlyVolume} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-full lg:col-span-1">
        <TransactionOverview
          pendingTransactions={summary.pendingTransactions}
          completedTransactions={summary.completedTransactions}
          failedTransactions={summary.failedTransactions}
        />
      </div>

      <div className="col-span-4">
        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <UsersByGenderChart totalUsers={summary.totalUsers} />
          </div>
          <div>
            <UserTransactions monthlyVolume={monthlyVolume} />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="col-span-4">
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
