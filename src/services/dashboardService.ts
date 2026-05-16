import api from '../api/apiClient';
import { DashboardStats } from '../models/ui_types/dashboard';

// ─── BE Response Type ───────────────────────────────────────
interface RevenueChartDto {
  date: string;
  totalRevenue: number;
  orderCount: number;
}

export const dashboardService = {
  getSalesStats: async (): Promise<DashboardStats> => {
    // Fetch revenue chart data from BE
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let revenueData: RevenueChartDto[] = [];
    try {
      revenueData = await api.get<RevenueChartDto[]>(
        `/admin/statistics/revenue?startDate=${thirtyDaysAgo.toISOString()}&endDate=${now.toISOString()}`,
      );
    } catch {
      // Statistics endpoint might fail — return defaults
    }

    // Map to FE format
    const totalRevenue = revenueData.reduce((sum, d) => sum + d.totalRevenue, 0);
    const totalOrders = revenueData.reduce((sum, d) => sum + d.orderCount, 0);

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      activeCustomers: 0, // Not available from BE
      revenueTrend: revenueData.map(d => ({
        month: d.date,
        revenue: d.totalRevenue,
        orders: d.orderCount,
      })),
      categoryDistribution: [], // Not available from BE
      recentOrders: [], // Would need separate call to order endpoint
      pendingOrders: 0,
      shippingOrders: 0,
      deliveredOrders: 0,
      averageProcessingTime: 'N/A',
    };
  },
};
