"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";

interface TransactionsHeaderProps {
  onSearch?: (query: string) => void;
  onStatusFilter?: (status: string) => void;
  onDateFilter?: (fromDate: string, toDate: string) => void;
  onUserFilter?: (userId: string) => void;
}

const TransactionsHeader: React.FC<TransactionsHeaderProps> = ({
  onSearch,
  onStatusFilter,
  onUserFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedUser, setSelectedUser] = useState("All Customer");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusFilter?.(status === "All Status" ? "" : status);
  };

  const handleUserChange = (user: string) => {
    setSelectedUser(user);
    onUserFilter?.(user === "All Customer" ? "" : user);
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <Button
          variant="ghost"
          className="w-full justify-between font-normal text-gray-600 hover:bg-white/50 rounded-full bg-white"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span>All Time</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>

        <div className="relative">
          <select
            value={selectedUser}
            onChange={(e) => handleUserChange(e.target.value)}
            className="appearance-none w-full justify-between font-normal text-gray-600 hover:bg-white/50 rounded-full bg-white border border-gray-200 py-2 px-4 pr-8 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="All Customer">All Customer</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="appearance-none w-full justify-between font-normal text-gray-600 hover:bg-white/50 rounded-full bg-white border border-gray-200 py-2 px-4 pr-8 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Search and Add Transaction */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search transaction ID, user, etc."
            className="bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 w-full sm:w-64 focus:ring-1 outline-0 focus:ring-primary focus:border-primary"
          />
        </div>
        <Button className="bg-[#0A4F49] hover:bg-[#083b36] text-white w-full sm:w-auto rounded-full">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default TransactionsHeader;
