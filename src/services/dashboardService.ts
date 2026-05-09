import { salesData, categoryData, orders } from '../data/mockData';
import { DashboardStats } from '../models/ui_types/dashboard';
import { OrderStatus } from '../models/ui_types/order';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getSalesStats: async (): Promise<DashboardStats> => {
    await delay(1200);
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalRevenue / (orders.length || 1);
    
    return {
      totalRevenue,
      totalOrders: orders.length,
      avgOrderValue,
      activeCustomers: 1234,
      revenueTrend: salesData,
      categoryDistribution: categoryData,
      recentOrders: orders.slice(0, 5),
      
      // Calculate operational metrics
      pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING).length,
      shippingOrders: orders.filter(o => o.status === OrderStatus.SHIPPING).length,
      deliveredOrders: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
      averageProcessingTime: "2.4h"
    };
  }
};
