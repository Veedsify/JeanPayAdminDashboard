"use client";
import { useState } from "react";
import TransactionsHeader from "@/components/transactions/TransactionsHeader";
import TransactionsStats from "@/components/transactions/TransactionsStats";
import TransactionsTable from "@/components/transactions/TransactionsTable";

const TransactionsPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    user: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleUserFilter = (user: string) => {
    setFilters((prev) => ({ ...prev, user }));
  };

  const handleDateFilter = (fromDate: string, toDate: string) => {
    setFilters((prev) => ({ ...prev, dateFrom: fromDate, dateTo: toDate }));
  };

  return (
    <>
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">Transactions</h1> */}
      <TransactionsStats />
      <div className="space-y-6">
        <TransactionsHeader
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onUserFilter={handleUserFilter}
          onDateFilter={handleDateFilter}
        />
        <div className="bg-white p-6 rounded-2xl">
          <TransactionsTable filters={filters} />
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;
