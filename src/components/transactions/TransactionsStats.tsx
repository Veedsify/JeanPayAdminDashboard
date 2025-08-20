"use client";
import useAdminTransactions from "@/data/hooks/AdminTransactionsHook";
import { useMemo } from "react";

const StatCard = ({
  title,
  value,
  className,
  isLoading,
}: {
  title: string;
  value: string | number;
  className?: string;
  isLoading?: boolean;
}) => {
  return (
    <div className={`rounded-2xl p-6 text-white ${className}`}>
      <p className="text-base font-normal">{title}</p>
      {isLoading ? (
        <div className="animate-pulse bg-white/20 h-10 w-24 rounded mt-2"></div>
      ) : (
        <p className="text-4xl font-bold mt-2">{value}</p>
      )}
    </div>
  );
};

const TransactionsStats = () => {
  const { useTransactionOverview } = useAdminTransactions();
  const { data: overview, isLoading, error } = useTransactionOverview();

  // Get stats from the summary data returned by backend
  const stats = useMemo(() => {
    if (!overview?.data) {
      return {
        totalTransactions: 0,
        pendingTransactions: 0,
        completedTransactions: 0,
      };
    }

    const summary = overview.data;

    return {
      totalTransactions: summary.total_transactions || 0,
      pendingTransactions: summary.pending_transactions || 0,
      completedTransactions: summary.completed_transactions || 0,
    };
  }, [overview]);

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
        <div className="rounded-2xl p-6 text-white bg-red-500">
          <p className="text-base font-normal">Error loading stats</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
      <StatCard
        title="Total Transactions"
        value={stats.totalTransactions.toLocaleString()}
        className="bg-secondary"
        isLoading={isLoading}
      />
      <StatCard
        title="Pending Transactions"
        value={stats.pendingTransactions.toLocaleString()}
        className="bg-primary"
        isLoading={isLoading}
      />
      <StatCard
        title="Completed Transactions"
        value={stats.completedTransactions.toLocaleString()}
        className="bg-secondary"
        isLoading={isLoading}
      />
    </div>
  );
};

export default TransactionsStats;
