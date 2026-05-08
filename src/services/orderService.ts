import { orders } from '../data/mockData';
import { Order } from '../models/ui_types/order';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    await delay(1000);
    return [...orders];
  },

  createOrder: async (orderData: any): Promise<Order> => {
    await delay(1500);
    const newOrder = {
      ...orderData,
      id: `ORD${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString(),
      status: 'pending'
    };
    // In a real app, we would push to DB. Here we just return it.
    return newOrder;
  }
};
