"use client";

interface UsersByGenderChartProps {
  totalUsers?: number;
}

export function UsersByGenderChart({
  totalUsers = 0,
}: UsersByGenderChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Users by Gender
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-2xl font-bold text-gray-900">
              {totalUsers.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">Total Users</span>
          </div>
        </div>
        <select className="border border-gray-300 rounded-2xl px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
          <option>Last 8 Months</option>
          <option>Last 6 Months</option>
          <option>Last 12 Months</option>
        </select>
      </div>

      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Gender analytics coming soon</p>
          <p className="text-gray-400 text-xs mt-1">
            User demographics will be available in the next update
          </p>
        </div>
      </div>
    </div>
  );
}
