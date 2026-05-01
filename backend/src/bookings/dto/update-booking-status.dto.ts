import { IsIn, IsOptional } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed', 'review'])
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'review';

  @IsOptional()
  @IsIn(['pending', 'paid', 'failed', 'refunded'])
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
}
