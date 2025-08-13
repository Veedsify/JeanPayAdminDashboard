export interface Transaction {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  direction: string;
  paymentMethod: "MOMO" | "PAYSTACK";
  amount: string;
  date: string;
  status: "Paid" | "Pending";
}
