import { PartialType } from '@nestjs/mapped-types';
import { CreateMomentCapturedDto } from './create-moment-captured.dto';

export class UpdateMomentCapturedDto extends PartialType(CreateMomentCapturedDto) {}
