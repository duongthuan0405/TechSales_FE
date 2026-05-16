import api, { PagedResponse } from '../api/apiClient';
import { Voucher } from '../models/ui_types/voucher';

// ─── BE returns Voucher entity directly ─────────────────────
// Note: This is admin-only API. Customer validate is not available.

export const voucherService = {
  getAvailableVouchers: async (): Promise<Voucher[]> => {
    const paged = await api.get<PagedResponse<Voucher>>(
      '/admin/vouchers?pageNumber=1&pageSize=100',
    );
    return paged.items;
  },

  validateVoucher: async (
    code: string,
    _orderAmount: number,
  ): Promise<{
    valid: boolean;
    discount: number;
    message: string;
    voucher?: Voucher;
  }> => {
    // BE doesn't have a customer-facing validate endpoint
    // Try to find from admin list as a workaround
    try {
      const vouchers = await voucherService.getAvailableVouchers();
      const voucher = vouchers.find(
        v => v.code.toUpperCase() === code.toUpperCase() && v.isActive,
      );

      if (!voucher) {
        return { valid: false, discount: 0, message: 'Invalid or expired voucher code' };
      }

      if (voucher.minOrderAmount && _orderAmount < voucher.minOrderAmount) {
        return {
          valid: false,
          discount: 0,
          message: `Minimum order amount of $${voucher.minOrderAmount} required`,
        };
      }

      let discount = 0;
      if (voucher.type === 'FIXED') {
        discount = voucher.value;
      } else {
        discount = (_orderAmount * voucher.value) / 100;
        if (voucher.maxDiscountAmount && discount > voucher.maxDiscountAmount) {
          discount = voucher.maxDiscountAmount;
        }
      }

      return { valid: true, discount, message: 'Voucher applied successfully', voucher };
    } catch {
      return { valid: false, discount: 0, message: 'Unable to validate voucher' };
    }
  },
};
