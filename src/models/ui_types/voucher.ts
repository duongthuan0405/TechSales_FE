export enum VoucherType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  type: VoucherType;
  value: number; // Amount or percentage
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt?: string;
}
