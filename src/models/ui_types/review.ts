export enum ReviewStatus {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED'
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number; // 1 to 5
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt?: string;
}
