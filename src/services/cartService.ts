import { mockCart, products } from '../data/mockData';
import { CartItem } from '../models/ui_types/cart';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const joinProductDetails = (items: any[]): CartItem[] => {
  return items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      productName: product?.name,
      price: product?.price,
      imageUrl: product?.imageUrl
    };
  });
};

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    await delay(600);
    return joinProductDetails([...mockCart]);
  },

  addToCart: async (productId: string): Promise<CartItem[]> => {
    await delay(800);
    const existing = mockCart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      mockCart.push({ cartId: 'default', productId, quantity: 1 });
    }
    return joinProductDetails([...mockCart]);
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
    return joinProductDetails([...mockCart]);
  },

  removeItem: async (productId: string): Promise<CartItem[]> => {
    await delay(500);
    const index = mockCart.findIndex(item => item.productId === productId);
    if (index !== -1) {
      mockCart.splice(index, 1);
    }
    return joinProductDetails([...mockCart]);
  },

  clearCart: async (): Promise<void> => {
    await delay(500);
    mockCart.length = 0;
  }
};
