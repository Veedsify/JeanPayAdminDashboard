const StatCard = ({
  title,
  value,
  className,
}: {
  title: string;
  value: string | number;
  className?: string;
}) => {
  return (
    <div className={`rounded-2xl p-6 text-white ${className}`}>
      <p className="text-base font-normal">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
};

const TransactionsStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
      <StatCard
        title="Total Transactions"
        value="815"
        className="bg-secondary"
      />
      <StatCard
        title="Pending Transactions"
        value="430"
        className="bg-orange-500"
      />
      <StatCard
        title="Completed Transactions"
        value="205"
        className="bg-secondary"
      />
    </div>
  );
};

export default TransactionsStats;
