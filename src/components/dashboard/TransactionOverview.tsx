"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useDashboardStore } from "@/store/dashboard";

export function TransactionOverview() {
  const stats = useDashboardStore((state) => state.stats);

  const data = [
    {
      name: "Nigerians",
      value: stats.transactionOverview.nigerians,
      color: "#0d9488",
    },
    {
      name: "Ghanians",
      value: stats.transactionOverview.ghanians,
      color: "#f97316",
    },
  ];

  const total = stats.transactionOverview.total;

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Transaction Overview
        </h3>
        <select className="border border-gray-300 rounded-2xl px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
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
