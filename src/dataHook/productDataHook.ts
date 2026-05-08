import { useQuery } from '@tanstack/react-query';
import { productService, ProductQueryParams } from '../services/productService';

export const useGetProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useGetBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => productService.getAllBrands(),
  });
};
