"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MonthlyVolume } from "@/types/admin-dashboard";
import { useState } from "react";

interface RevenueChartProps {
  monthlyVolume: MonthlyVolume[];
}

export function RevenueChart({ monthlyVolume }: RevenueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(
    new Date().getFullYear().toString(),
  );

  const safeVolume = Array.isArray(monthlyVolume) ? monthlyVolume : [];
  const depositEntry = safeVolume.find(
    (vol) => vol.direction === "DEPOSIT",
  ) || {
    total: 0,
    count: 0,
  };
  const withdrawalEntry = safeVolume.find(
    (vol) => vol.direction === "TRANSFER",
  ) || {
    total: 0,
    count: 0,
  };
  const depositTotal = Number(depositEntry.total) || 0;
  const withdrawalTotal = Number(withdrawalEntry.total) || 0;

  // Create mock monthly data since we only have current month data
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const selectedYear = parseInt(selectedPeriod, 10);
  const monthIndex = selectedYear === currentYear ? currentMonth : -1;
  const years = Array.from({ length: 4 }, (_, i) =>
    (currentYear - i).toString(),
  );

  const chartData = months.map((month, index) => ({
    month,
    Deposits: index === monthIndex ? depositTotal : 0,
    Withdrawals: index === monthIndex ? withdrawalTotal : 0,
    Volume: index === monthIndex ? depositTotal + withdrawalTotal : 0,
  }));

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Transaction Volume
        </h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-2xl px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(value) => `${value}`}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            <Line
              type="monotone"
              dataKey="Deposits"
              stroke="#0d9488"
              strokeWidth={2}
              dot={{ fill: "#0d9488", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Withdrawals"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Volume"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#6b7280", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
