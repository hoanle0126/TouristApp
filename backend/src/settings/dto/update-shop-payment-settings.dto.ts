import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateShopPaymentSettingsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bankBin?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bankName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accountName?: string;
}
