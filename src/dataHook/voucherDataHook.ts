import { useQuery } from '@tanstack/react-query';
import { voucherService } from '../services/voucherService';

export function useGetAvailableVouchers() {
  return useQuery({
    queryKey: ['vouchers'],
    queryFn: () => voucherService.getAvailableVouchers()
  });
}

export function useValidateVoucher() {
  return async (code: string, orderAmount: number) => {
    return voucherService.validateVoucher(code, orderAmount);
  };
}
