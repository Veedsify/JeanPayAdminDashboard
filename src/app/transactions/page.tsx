import { DashboardLayout } from "@/components/layout/DashboardLayout";
import TransactionsHeader from "@/components/transactions/TransactionsHeader";
import TransactionsStats from "@/components/transactions/TransactionsStats";
import TransactionsTable from "@/components/transactions/TransactionsTable";

const TransactionsPage = () => {
  return (
    <DashboardLayout>
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">Transactions</h1> */}
      <TransactionsStats />
      <div className="space-y-6">
        <TransactionsHeader />
        <div className="bg-white p-6 rounded-2xl">
          <TransactionsTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
