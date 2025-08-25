"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";
import useAdminDashboard from "@/data/hooks/AdminDashboardHook";
import { MonthlyVolume } from "@/types/admin-dashboard";

interface UserTransactionsProps {
  monthlyVolume: MonthlyVolume[];
}

export function UserTransactions({ monthlyVolume }: UserTransactionsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "Today" | "This Week" | "This Month"
  >("This Month");
  const { getDashboardOverview } = useAdminDashboard();

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const params = useMemo(() => {
    const now = new Date();
    let from = new Date();
    let to = new Date();

    if (selectedPeriod === "Today") {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (selectedPeriod === "This Week") {
      // Last 7 days (inclusive of today)
      const tmp = new Date(now);
      tmp.setDate(now.getDate() - 6);
      from = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else {
      // This Month
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return { from_date: formatDate(from), to_date: formatDate(to) };
  }, [selectedPeriod]);

  const overviewQuery = getDashboardOverview(params);
  const effectiveMonthlyVolume: MonthlyVolume[] =
    (overviewQuery.data as any)?.data?.monthlyVolume ?? monthlyVolume;

  const depositData = effectiveMonthlyVolume.find(
    (vol) => vol.direction === "DEPOSIT",
  ) || {
    total: 0,
    count: 0,
  };
  const transferData = effectiveMonthlyVolume.find(
    (vol) => vol.direction === "TRANSFER",
  ) || {
    total: 0,
    count: 0,
  };

  const totalTransactions = depositData.count + transferData.count;
  const depositPercentage =
    totalTransactions > 0
      ? Math.round((depositData.count / totalTransactions) * 100)
      : 0;
  const transferPercentage =
    totalTransactions > 0
      ? Math.round((transferData.count / totalTransactions) * 100)
      : 0;

  const data = [
    {
      name: "Deposits",
      value: depositData.count,
      percentage: depositPercentage,
      color: "#0d9488",
    },
    {
      name: "Transfers",
      value: transferData.count,
      percentage: transferPercentage,
      color: "#f97316",
    },
  ];

  const total = totalTransactions;

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          User Transactions
        </h3>
        <select
          value={selectedPeriod}
          onChange={(e) =>
            setSelectedPeriod(
              e.target.value as "Today" | "This Week" | "This Month",
            )
          }
          className="border border-gray-300 rounded-2xl px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        >
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
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
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-900">{total}</div>
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
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {item.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
