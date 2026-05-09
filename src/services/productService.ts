import { products } from '../data/mockData';
import { Product, ProductStatus } from '../models/ui_types/product';
import { delay } from '../app/utils/delay';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  limit?: number;
}

export const productService = {
  getProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
    await delay(800); // Simulate network lag
    let result = [...products];

    // Filter by Search
    if (params?.search) {
      const search = params.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.brand?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    // Filter by Category
    if (params?.category && params.category !== 'all') {
      result = result.filter(p => p.categoryName === params.category);
    }

    // Filter by Price Range
    if (params?.minPrice !== undefined) {
      result = result.filter(p => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined && params.maxPrice > 0) {
      result = result.filter(p => p.price <= params.maxPrice!);
    }

    // Filter by Brand
    if (params?.brand && params.brand !== 'all') {
      const brandQuery = params.brand.toLowerCase();
      result = result.filter(p => p.brand?.toLowerCase().includes(brandQuery));
    }

    // Sorting
    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
          break;
      }
    }

    if (params?.limit) {
      result = result.slice(0, params.limit);
    }

    return result;
  },

  getProductById: async (id: string): Promise<Product> => {
    await delay(500);
    const product = products.find((p: Product) => p.id === id);
    if (!product) throw new Error('Product not found');
    return { ...product };
  },

  getAllBrands: async (): Promise<string[]> => {
    await delay(300);
    const brands = products.map(p => p.brand).filter((b): b is string => !!b);
    return Array.from(new Set(brands));
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    await delay(1000);
    const newProduct: Product = {
      ...product,
      id: `P${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    await delay(1000);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    products[index] = {
      ...products[index],
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    return products[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(800);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products.splice(index, 1);
  },

  toggleProductDiscontinue: async (id: string): Promise<Product> => {
    await delay(1000);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    products[index].status = products[index].status === ProductStatus.DISCONTINUED 
      ? ProductStatus.ACTIVE 
      : ProductStatus.DISCONTINUED;
      
    products[index].updatedAt = new Date().toISOString();
    return { ...products[index] };
  }
};
