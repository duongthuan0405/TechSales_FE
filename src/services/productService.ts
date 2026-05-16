import api from '../api/apiClient';
import { Product, ProductStatus } from '../models/ui_types/product';

// ─── BE Response Types ──────────────────────────────────────
interface ProductImageDto {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

interface ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  categoryId: string;
  images: ProductImageDto[];
}

interface ProductDetailDto extends ProductResponseDto {
  stockStatus: string;
  availableQuantity: number;
}

// ─── Mapping BE → FE ────────────────────────────────────────
const mapProduct = (dto: ProductResponseDto): Product => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  price: dto.price,
  brand: dto.brand,
  categoryId: dto.categoryId,
  imageUrl: dto.images?.find(img => img.isPrimary)?.imageUrl || dto.images?.[0]?.imageUrl,
  images: dto.images?.map(img => img.imageUrl),
  stock: 0,  // Not available in list response
  status: ProductStatus.ACTIVE,
  createdAt: '',
});

const mapProductDetail = (dto: ProductDetailDto): Product => ({
  ...mapProduct(dto),
  stock: dto.availableQuantity,
  status: dto.stockStatus === 'OUT_OF_STOCK' ? ProductStatus.DISCONTINUED : ProductStatus.ACTIVE,
});

// ─── Public Interface (signatures kept compatible) ──────────
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
    const query = new URLSearchParams();

    if (params?.search) query.set('keyword', params.search);
    if (params?.category && params.category !== 'all') {
      query.append('categoryIds', params.category);
    }
    if (params?.sortBy) {
      // Map FE sort to BE SortOrder enum (ASC=1, DESC=2)
      // Note: BE only supports price sorting via ASC/DESC in SearchProductsAsync
      const sortMap: Record<string, string> = {
        price_asc: 'ASC',
        price_desc: 'DESC',
      };
      
      const mappedSort = sortMap[params.sortBy];
      if (mappedSort) {
        query.set('sortOrder', mappedSort);
      }
    }

    const queryStr = query.toString();
    const products = await api.get<ProductResponseDto[]>(
      `/product${queryStr ? `?${queryStr}` : ''}`,
    );

    let result = products.map(mapProduct);

    // Client-side filtering for params not supported by BE
    if (params?.minPrice !== undefined) {
      result = result.filter(p => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined && params.maxPrice > 0) {
      result = result.filter(p => p.price <= params.maxPrice!);
    }
    if (params?.brand && params.brand !== 'all') {
      const brandQuery = params.brand.toLowerCase();
      result = result.filter(p => p.brand?.toLowerCase().includes(brandQuery));
    }
    if (params?.limit) {
      result = result.slice(0, params.limit);
    }

    return result;
  },

  getProductById: async (id: string): Promise<Product> => {
    const dto = await api.get<ProductDetailDto>(`/product/${id}`);
    return mapProductDetail(dto);
  },

  getAllBrands: async (): Promise<string[]> => {
    // BE doesn't have a dedicated brands endpoint
    // Derive from product list
    const products = await api.get<ProductResponseDto[]>('/product');
    const brands = products.map(p => p.brand).filter(Boolean);
    return Array.from(new Set(brands));
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const result = await api.post<ProductResponseDto>('/admin/products', {
      name: product.name,
      description: product.description,
      price: product.price,
      brand: product.brand,
      categoryId: product.categoryId,
      initialStock: product.stock || 0,
      images: product.images?.map((url, i) => ({
        imageUrl: url,
        isPrimary: i === 0,
      })) || [],
    });
    return mapProduct(result);
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    await api.put(`/admin/products/${id}`, {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      brand: productData.brand,
      categoryId: productData.categoryId,
      images: productData.images?.map((url, i) => ({
        imageUrl: url,
        isPrimary: i === 0,
      })) || [],
    });
    // Refetch to get updated product
    return productService.getProductById(id);
  },

  deleteProduct: async (id: string): Promise<void> => {
    // BE only supports discontinue, not delete
    await api.patch(`/admin/products/${id}/status`);
  },

  toggleProductDiscontinue: async (id: string): Promise<Product> => {
    await api.patch(`/admin/products/${id}/status`);
    return productService.getProductById(id);
  },
};
