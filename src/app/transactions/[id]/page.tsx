import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

const TransactionDetails = () => {
  return (
    <DashboardLayout>
      <div
        className="
        flex justify-between items-center mb-4
      "
      >
        <Link
          href="/transactions"
          className="text-secondary font-bold flex items-center hover:underline"
        >
          <ArrowLeftIcon className="mr-2" />
          Back to Transactions
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Transaction Information */}
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Transaction Information
              </h2>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  color="danger"
                  className="px-6 py-2 h-auto bg-red-500 text-white"
                >
                  Decline
                </Button>
                <Button
                  variant="ghost"
                  color="success"
                  className="px-6 py-2 h-auto bg-emerald-500 text-white"
                >
                  Approve
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-semibold">JP-KHDHKSSS</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="font-semibold">450</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-semibold">NGN 100,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Amount Reciepient Receives
                </p>
                <p className="font-semibold">GHS 2,500</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Exchange Rate</p>
                <p className="font-semibold">1 NGN = 0.025 GHS</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">January 15, 2025</p>
              </div>
            </div>
          </div>

          {/* Status Logs */}
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Status Logs
              </h2>
              <button className="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
            <div className="relative pl-4">
              <div className="absolute left-6 top-2 bottom-4 w-0.5 bg-gray-200"></div>
              <div className="relative mb-8">
                <div className="absolute -left-1.5 top-0.5 flex items-center justify-center w-8 h-8">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-orange-400 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-8">
                  <p className="font-semibold">Transaction Initiated</p>
                  <p className="text-sm text-gray-500">2025-02-12 10:44 AM</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-1.5 top-0.5 flex items-center justify-center w-8 h-8">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-orange-400 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-8">
                  <p className="font-semibold">Transaction Pending</p>
                  <p className="text-sm text-gray-500">2025-02-12 10:44 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex justify-end">
              <button className="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center -mt-2">
              <div className="w-24 h-24 bg-orange-500 rounded-full mb-4"></div>
              <h3 className="text-xl font-bold">Anahera Jones</h3>
              <p className="text-gray-500">@anahera</p>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Contact Info
                </h2>
                <button className="text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">USER ID</p>
                  <p className="font-semibold">PB-002</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GENDER</p>
                  <p className="font-semibold">Male</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">EMAIL</p>
                  <p className="font-semibold">jones@gmail.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">PHONE</p>
                  <p className="font-semibold">090 5657 7878</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">COUNTRY</p>
                  <p className="font-semibold">Nigeria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransactionDetails;
