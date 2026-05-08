import { mockCart } from '../data/mockData';
import { CartItem } from '../models/ui_types/models';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    await delay(600);
    return [...mockCart];
  },

  addToCart: async (productId: string): Promise<CartItem[]> => {
    await delay(800);
    const existing = mockCart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      mockCart.push({ productId, quantity: 1 });
    }
    return [...mockCart];
  },

  updateQuantity: async (productId: string, quantity: number): Promise<CartItem[]> => {
    await delay(500);
    const index = mockCart.findIndex(item => item.productId === productId);
    if (index !== -1) {
      if (quantity < 1) {
        mockCart.splice(index, 1);
      } else {
        mockCart[index].quantity = quantity;
      }
    }
    return [...mockCart];
  },

  removeItem: async (productId: string): Promise<CartItem[]> => {
    await delay(500);
    const index = mockCart.findIndex(item => item.productId === productId);
    if (index !== -1) {
      mockCart.splice(index, 1);
    }
    return [...mockCart];
  },

  clearCart: async (): Promise<void> => {
    await delay(500);
    mockCart.length = 0;
  }
};
