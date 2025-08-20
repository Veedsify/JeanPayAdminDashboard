"use client";
import { TransactionWithUser } from "@/types/admin-transactions";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { TableCell, TableRow } from "../ui/Table";
import { getStatusColor } from "@/lib/utils";

interface TransactionRowProps {
  transaction: TransactionWithUser;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const {
    transaction_id,
    user,
    direction,
    payment_type,
    amount,
    currency,
    created_at,
    status,
  } = transaction;
  const router = useRouter();
  const handleTransactionRowClick = () => {
    router.push(`/transactions/${transaction_id}`);
  };

  // Format amount with currency (handle missing values)
  const formattedAmount =
    amount && currency ? `${currency} ${amount.toLocaleString()}` : "N/A";

  // Format date
  const formattedDate = new Date(created_at).toLocaleDateString();

  // Get user display name
  const userName = user
    ? `${user.first_name} ${user.last_name}`
    : "Unknown User";

  // Get user initials
  const userInitials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
    : "??";

  // Format status for display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Paid";
      case "PENDING":
        return "Pending";
      case "FAILED":
        return "Failed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  // Get payment method color
  const getPaymentMethodColor = (paymentType: string) => {
    switch (paymentType) {
      case "momo":
        return "bg-red-400";
      case "bank":
        return "bg-blue-400";
      default:
        return "bg-gray-400";
    }
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
        {transaction_id}
      </TableCell>
      <TableCell className="py-4 px-6 text-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">
            {userInitials}
          </div>
          <span>{userName}</span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 text-gray-700">
        {direction || "N/A"}
      </TableCell>
      <TableCell className="py-4 px-6 text-gray-700">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "w-2 h-2 rounded-full",
              getPaymentMethodColor(payment_type || ""),
            )}
          ></span>
          <span className="uppercase">{payment_type || "N/A"}</span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 font-medium text-gray-700">
        {formattedAmount}
      </TableCell>
      <TableCell className="py-4 px-6 text-gray-700">{formattedDate}</TableCell>
      <TableCell className="py-4 px-6">
        <span
          className={clsx(
            "py-1.5 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1",
            getStatusColor(status),
          )}
        >
          {getStatusDisplay(status)}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
