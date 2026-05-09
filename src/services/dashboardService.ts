import { salesData, categoryData, orders } from '../data/mockData';
import { DashboardStats } from '../models/ui_types/dashboard';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getSalesStats: async (): Promise<DashboardStats> => {
    await delay(1200);
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalRevenue / orders.length;
    
    return {
      totalRevenue,
      totalOrders: orders.length,
      avgOrderValue,
      activeCustomers: 1234,
      revenueTrend: salesData,
      categoryDistribution: categoryData,
      recentOrders: orders.slice(0, 5)
    };
  }
};
