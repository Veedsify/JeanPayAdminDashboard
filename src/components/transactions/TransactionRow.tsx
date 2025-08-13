"use client";
import { Transaction } from "@/types/transactions";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { TableCell, TableRow } from "../ui/Table";

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const { id, user, direction, paymentMethod, amount, date, status } =
    transaction;
  const router = useRouter();
  const handleTransactionRowClick = () => {
    router.push(`/transactions/${id}`);
  };

  return (
    <TableRow
      otherProps={{
        onClick: handleTransactionRowClick,
      }}
      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
    >
      <TableCell className="py-4 px-6">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </TableCell>
      <TableCell className="py-4 px-6 font-medium text-gray-700 whitespace-nowrap">
        {id}
      </TableCell>
      <TableCell className="py-4 px-6 text-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <span>{user.name}</span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 text-gray-700">{direction}</TableCell>
      <TableCell className="py-4 px-6 text-gray-700">
        <div className="flex items-center gap-2">
          <span
            className={clsx("w-2 h-2 rounded-full", {
              "bg-red-400": paymentMethod === "MOMO",
              "bg-green-400": paymentMethod === "PAYSTACK",
            })}
          ></span>
          <span>{paymentMethod}</span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 font-medium text-gray-700">
        {amount}
      </TableCell>
      <TableCell className="py-4 px-6 text-gray-700">{date}</TableCell>
      <TableCell className="py-4 px-6">
        <span
          className={clsx(
            "py-1.5 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1",
            {
              "bg-green-100 text-green-700": status === "Paid",
              "bg-yellow-100 text-yellow-700": status === "Pending",
            },
          )}
        >
          {status}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
