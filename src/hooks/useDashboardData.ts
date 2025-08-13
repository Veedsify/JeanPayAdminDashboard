'use client';

import { useQuery } from '@tanstack/react-query';
import { useDashboardStore } from '@/store/dashboard';

// Mock API function - replace with real API calls
const fetchDashboardStats = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock data - in real app, this would come from your API
    return {
        users: 2045,
        totalTransactions: 315,
        virtualAccountsCreated: 250,
        revenue: {
            income: [6000, 5500, 6200, 5800, 6500, 6800, 7200, 6900, 7500, 7800, 8200, 7900],
            expenses: [3000, 2800, 3200, 2900, 3400, 3600, 3800, 3500, 3900, 4100, 4300, 4000],
            netProfit: [2000, 2200, 2400, 2100, 2600, 2800, 3000, 2700, 3200, 3400, 3600, 3300],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        usersByGender: {
            male: [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250],
            female: [600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050],
            months: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            total: 27930
        },
        transactionOverview: {
            total: 3245,
            nigerians: 1460,
            ghanians: 974
        },
        userTransactions: {
            total: 315,
            nigerians: { count: 162, percentage: 45 },
            ghanians: { count: 110, percentage: 35 }
        }
    };
};

export function useDashboardData() {
    const updateStats = useDashboardStore((state) => state.updateStats);

    const query = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: fetchDashboardStats,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Update store when data changes
    if (query.data) {
        updateStats(query.data);
    }

    return query;
}