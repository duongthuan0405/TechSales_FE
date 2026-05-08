import { products } from '../data/mockData';
import { Product } from '../models/ui_types/product';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    await delay(800); // Simulate network lag
    return [...products];
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(500);
    return products.find((p: Product) => p.id === id);
  }
};
