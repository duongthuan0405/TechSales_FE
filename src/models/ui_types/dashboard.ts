import { Order } from './order';

export interface SalesData {
  month: string;
  revenue: number;
  orders: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  activeCustomers: number;
  revenueTrend: SalesData[];
  categoryDistribution: CategoryData[];
  recentOrders: Order[];
}
