"use client";
import { useState } from "react";
import TransactionRow from "./TransactionRow";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "../ui/Button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import useAdminTransactions from "@/data/hooks/AdminTransactionsHook";
import { TransactionQueryParams } from "@/types/admin-transactions";

interface TransactionsTableProps {
  filters?: {
    search: string;
    status: string;
    user: string;
    dateFrom: string;
    dateTo: string;
  };
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ filters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { useTransactions } = useAdminTransactions();

  const queryParams: TransactionQueryParams = {
    page: currentPage,
    limit: pageSize,
    ...(filters?.search && { search: filters.search }),
    ...(filters?.status && { status: filters.status }),
  };

  const { data, isLoading, error } = useTransactions(queryParams);

  const transactions = data?.data?.transactions || [];
  const pagination = data?.data?.pagination;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="mt-6 p-6 text-center text-red-600">
        <p>Error loading transactions. Please try again.</p>
      </div>
    );
  }
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <Table className="w-full text-sm text-left text-gray-500">
          <TableHeader className="text-xs text-gray-500 uppercase">
            <TableRow>
              <TableHead className="py-3 px-6">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </TableHead>
              <TableHead className="py-3 px-6">
                <button
                  className="flex items-center gap-1.5 hover:text-gray-700"
                  onClick={() => handleSort("transaction_id")}
                >
                  <span>Transaction ID</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="py-3 px-6">
                <button
                  className="flex items-center gap-1.5 hover:text-gray-700"
                  onClick={() => handleSort("user")}
                >
                  <span>Users</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="py-3 px-6">
                <button
                  className="flex items-center gap-1.5 hover:text-gray-700"
                  onClick={() => handleSort("direction")}
                >
                  <span>Direction</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="py-3 px-6">
                <button
                  className="flex items-center gap-1.5 hover:text-gray-700"
                  onClick={() => handleSort("payment_type")}
                >
                  <span>Payment Method</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="py-3 px-6">
                <button
                  className="flex items-center gap-1.5 hover:text-gray-700"
                  onClick={() => handleSort("amount")}
                >
                  <span>Amount</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="py-3 px-6">
                <button
                  className="flex items-center gap-1.5 hover:text-gray-700"
                  onClick={() => handleSort("created_at")}
                >
                  <span>Date</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="py-3 px-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index}>
                  <td className="py-4 px-6">
                    <div className="animate-pulse bg-gray-200 h-4 w-4 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                  </td>
                </tr>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.transaction_id}
                  transaction={transaction}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 px-6 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center mt-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Showing</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded px-3 py-2 pr-8 text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          <span className="text-gray-600">out of {pagination?.total || 0}</span>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 bg-gray-100/70 rounded-full"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft size={20} />
            </Button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant="default"
                  size="icon"
                  className={`h-9 w-9 rounded-full ${
                    currentPage === pageNum
                      ? "bg-primary text-white"
                      : "bg-gray-100/70 text-gray-600"
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            {pagination.pages > 5 && currentPage < pagination.pages - 2 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-gray-100/70 text-gray-600"
                  disabled
                >
                  ...
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-gray-100/70 text-gray-600"
                  onClick={() => handlePageChange(pagination.pages)}
                >
                  {pagination.pages}
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 bg-gray-100/70 rounded-full"
              disabled={currentPage === pagination.pages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
