import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import { Review } from '../models/ui_types/review';

export const useGetProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getReviewsByProductId(productId),
    enabled: !!productId,
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => 
      reviewService.submitReview(reviewData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
};
