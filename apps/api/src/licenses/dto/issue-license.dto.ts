import { IsDateString, IsIn, IsOptional, IsUUID } from 'class-validator';
import { PRODUCT_SLUGS } from '../../common/catalog';

export class IssueLicenseDto {
  @IsUUID()
  userId!: string;

  @IsIn(PRODUCT_SLUGS)
  productSlug!: string;

  /** Omit for a perpetual licence. */
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
