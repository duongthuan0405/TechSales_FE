import { Voucher, VoucherType } from '../models/ui_types/voucher';
import { delay } from '../app/utils/delay';
import { vouchers } from '../data/mockData';

export const voucherService = {
  getAvailableVouchers: async (): Promise<Voucher[]> => {
    await delay(600);
    return [...vouchers];
  },

  validateVoucher: async (code: string, orderAmount: number): Promise<{ 
    valid: boolean; 
    discount: number; 
    message: string; 
    voucher?: Voucher 
  }> => {
    await delay(400);
    
    const voucher = vouchers.find(v => v.code.toUpperCase() === code.toUpperCase() && v.isActive);
    
    if (!voucher) {
      return { valid: false, discount: 0, message: 'Invalid or expired voucher code' };
    }

    if (voucher.minOrderAmount && orderAmount < voucher.minOrderAmount) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum order amount of $${voucher.minOrderAmount} required` 
      };
    }

    let discount = 0;
    if (voucher.type === VoucherType.FIXED) {
      discount = voucher.value;
    } else {
      discount = (orderAmount * voucher.value) / 100;
      if (voucher.maxDiscountAmount && discount > voucher.maxDiscountAmount) {
        discount = voucher.maxDiscountAmount;
      }
    }

    return { valid: true, discount, message: 'Voucher applied successfully', voucher };
  }
};
