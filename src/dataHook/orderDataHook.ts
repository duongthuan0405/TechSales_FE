import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, CheckoutPreviewParams } from '../services/orderService';

export const useGetOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
  });
};

export const useGetOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
};

export const useCheckoutSummary = (params: CheckoutPreviewParams) => {
  return useQuery({
    queryKey: ['checkout-summary', params],
    queryFn: () => orderService.calculateCheckoutSummary(params),
    enabled: params.items.length > 0,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData: any) => orderService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
};
