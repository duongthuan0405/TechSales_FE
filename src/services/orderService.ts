import { orders, products } from '../data/mockData';
import { Order, OrderStatus } from '../models/ui_types/order';
import { delay } from '../utils/delay';

export interface CheckoutPreviewParams {
  items: { productId: string; quantity: number }[];
  couponCode?: string;
}

export interface CheckoutSummary {
  subtotal: number;
  shippingFee: number;
  total: number;
  discount: number;
}

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    await delay(1000);
    return [...orders];
  },

  getOrderById: async (id: string): Promise<Order> => {
    await delay(800);
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return { ...order };
  },

  calculateCheckoutSummary: async (params: CheckoutPreviewParams): Promise<CheckoutSummary> => {
    await delay(500);
    
    // Calculate actual subtotal from items
    let subtotal = 0;
    params.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    });

    const shippingFee = subtotal > 1000 ? 0 : 50;
    const discount = 0; // Vouchers are handled in UI for now or can be added here
    
    return {
      subtotal,
      shippingFee,
      total: subtotal + shippingFee - discount,
      discount
    };
  },

  createOrder: async (orderData: any): Promise<Order> => {
    await delay(1500);
    const newOrder: Order = {
      ...orderData,
      id: `ORD${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      status: OrderStatus.PENDING,
      customerName: 'Demo Customer' // Simulated
    };
    orders.unshift(newOrder); // Add to mock DB
    return newOrder;
  },

  cancelOrder: async (id: string): Promise<void> => {
    await delay(1000);
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    if (order.status !== OrderStatus.PENDING) {
      throw new Error('Only pending orders can be cancelled');
    }
    order.status = OrderStatus.CANCELLED;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<void> => {
    await delay(1000);
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    order.status = status;
  }
};
