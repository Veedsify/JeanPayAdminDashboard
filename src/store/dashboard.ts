import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Transaction {
  id: string;
  patient: string;
  patientId: string;
  treatment: string;
  doctor: string;
  date: string;
  time: string;
  status: "completed" | "in-progress" | "cancelled";
}

interface DashboardStats {
  users: number;
  totalTransactions: number;
  virtualAccountsCreated: number;
  revenue: {
    income: number[];
    expenses: number[];
    netProfit: number[];
    months: string[];
  };
  usersByGender: {
    male: number[];
    female: number[];
    months: string[];
    total: number;
  };
  transactionOverview: {
    total: number;
    nigerians: number;
    ghanians: number;
  };
  userTransactions: {
    total: number;
    nigerians: { count: number; percentage: number };
    ghanians: { count: number; percentage: number };
  };
}

interface DashboardState {
  currentUser: User;
  stats: DashboardStats;
  recentTransactions: Transaction[];
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  updateStats: (stats: Partial<DashboardStats>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  currentUser: {
    id: "1",
    name: "Anahera Jones",
    email: "anahera@jeanpay.com",
    avatar: "/api/placeholder/32/32",
  },
  stats: {
    users: 2045,
    totalTransactions: 315,
    virtualAccountsCreated: 250,
    revenue: {
      income: [
        6000, 5500, 6200, 5800, 6500, 6800, 7200, 6900, 7500, 7800, 8200, 7900,
      ],
      expenses: [
        3000, 2800, 3200, 2900, 3400, 3600, 3800, 3500, 3900, 4100, 4300, 4000,
      ],
      netProfit: [
        2000, 2200, 2400, 2100, 2600, 2800, 3000, 2700, 3200, 3400, 3600, 3300,
      ],
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    usersByGender: {
      male: [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250],
      female: [600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050],
      months: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      total: 27930,
    },
    transactionOverview: {
      total: 3245,
      nigerians: 1460,
      ghanians: 974,
    },
    userTransactions: {
      total: 315,
      nigerians: { count: 162, percentage: 45 },
      ghanians: { count: 110, percentage: 35 },
    },
  },
  recentTransactions: [
    {
      id: "PR-101",
      patient: "Sarah Miller",
      patientId: "PR-101",
      treatment: "5,000",
      doctor: "NGN - GHS",
      date: "2028-09-12",
      time: "09:00 AM",
      status: "completed",
    },
    {
      id: "PR-102",
      patient: "Maurice Galley",
      patientId: "PR-102",
      treatment: "6,000",
      doctor: "GHS - NGN",
      date: "2028-09-12",
      time: "12:00 PM",
      status: "in-progress",
    },
    {
      id: "PR-103",
      patient: "Julia Watson",
      patientId: "PR-103",
      treatment: "8,000",
      doctor: "NGN - GHS",
      date: "2028-09-12",
      time: "02:30 PM",
      status: "cancelled",
    },
    {
      id: "PR-104",
      patient: "Stephen Hawk",
      patientId: "PR-104",
      treatment: "5,000",
      doctor: "GHS - NGN",
      date: "2028-09-12",
      time: "04:30 PM",
      status: "completed",
    },
    {
      id: "PR-105",
      patient: "Emma Wilson",
      patientId: "PR-105",
      treatment: "90,000",
      doctor: "NGN - GHS",
      date: "2028-09-13",
      time: "08:30 AM",
      status: "in-progress",
    },
  ],
  selectedPeriod: "2027",
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),
}));
