import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelerReviewDto } from './create-traveler-review.dto';

export class UpdateTravelerReviewDto extends PartialType(
  CreateTravelerReviewDto,
) {}
