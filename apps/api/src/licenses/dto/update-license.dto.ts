import { LicenseStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';

export class UpdateLicenseDto {
  @IsOptional()
  @IsEnum(LicenseStatus)
  status?: LicenseStatus;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
