import TransactionRow from "./TransactionRow";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "../ui/Button";
import { transactions } from "@/data/transactions";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";

const TransactionsTable = () => {
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
                <div className="flex items-center gap-1.5">
                  <span>Transaction ID</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="py-3 px-6">
                <div className="flex items-center gap-1.5">
                  <span>Users</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="py-3 px-6">
                <div className="flex items-center gap-1.5">
                  <span>Direction</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="py-3 px-6">
                <div className="flex items-center gap-1.5">
                  <span>Payment Method</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="py-3 px-6">
                <div className="flex items-center gap-1.5">
                  <span>Amount</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="py-3 px-6">
                <div className="flex items-center gap-1.5">
                  <span>Date</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="py-3 px-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center mt-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Showing</span>
          <Button
            variant="ghost"
            className="font-normal border text-gray-600 px-3"
          >
            <div className="flex items-center gap-2">
              <span>10</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </Button>
          <span className="text-gray-600">out of 512</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-gray-100/70 rounded-full"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9 bg-primary rounded-full"
          >
            1
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
          >
            2
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
          >
            3
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
          >
            ...
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
          >
            16
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
