import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};
