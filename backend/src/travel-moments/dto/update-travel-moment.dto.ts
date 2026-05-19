import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelMomentDto } from './create-travel-moment.dto';

export class UpdateTravelMomentDto extends PartialType(CreateTravelMomentDto) {}
