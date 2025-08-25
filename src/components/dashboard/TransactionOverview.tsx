"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";
import useAdminDashboard from "@/data/hooks/AdminDashboardHook";

interface TransactionOverviewProps {
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
}

export function TransactionOverview({
  pendingTransactions,
  completedTransactions,
  failedTransactions,
}: TransactionOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "Monthly" | "Weekly" | "Daily"
  >("Monthly");
  const { getDashboardOverview } = useAdminDashboard();

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const params = useMemo(() => {
    const now = new Date();
    let from = new Date();
    let to = new Date();

    if (selectedPeriod === "Daily") {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (selectedPeriod === "Weekly") {
      const tmp = new Date(now);
      tmp.setDate(now.getDate() - 6);
      from = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else {
      // Monthly
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return { from_date: formatDate(from), to_date: formatDate(to) };
  }, [selectedPeriod]);

  const overviewQuery = getDashboardOverview(params);
  const summary = (overviewQuery.data as any)?.data?.summary;

  const effectiveCompleted =
    typeof summary?.completedTransactions === "number"
      ? summary.completedTransactions
      : completedTransactions;

  const effectivePending =
    typeof summary?.pendingTransactions === "number"
      ? summary.pendingTransactions
      : pendingTransactions;

  const effectiveFailed =
    typeof summary?.failedTransactions === "number"
      ? summary.failedTransactions
      : failedTransactions;

  const data = [
    {
      name: "Completed",
      value: effectiveCompleted,
      color: "#0d9488",
    },
    {
      name: "Pending",
      value: effectivePending,
      color: "#f97316",
    },
    {
      name: "Failed",
      value: effectiveFailed,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  const total = effectivePending + effectiveCompleted + effectiveFailed;

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Transaction Overview
        </h3>
        <select
          value={selectedPeriod}
          onChange={(e) =>
            setSelectedPeriod(e.target.value as "Monthly" | "Weekly" | "Daily")
          }
          className="border border-gray-300 rounded-2xl px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        >
          <option value="Monthly">Monthly</option>
          <option value="Weekly">Weekly</option>
          <option value="Daily">Daily</option>
        </select>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Transaction</div>
              <div className="text-2xl font-bold text-gray-900">
                {total.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
