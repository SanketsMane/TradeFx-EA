import { IsBoolean, IsIn, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { PRODUCT_SLUGS } from '../../common/catalog';

export class CreateCopierDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsUUID()
  sourceAccountId!: string;

  /**
   * The catalogue product this master runs, e.g. "scalper".
   *
   * Without it a customer holding a licence for that product cannot be
   * connected: PortalService.linkAccount looks the master up by slug and
   * refuses when there is none. Optional so an internal copier with no
   * product attached is still possible.
   */
  @IsOptional()
  @IsIn(PRODUCT_SLUGS)
  productSlug?: string;
}

export class UpdateCopierDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  /** Pass null to detach the master from its product. */
  @IsOptional()
  @IsIn([...PRODUCT_SLUGS, null] as unknown as string[])
  productSlug?: string | null;
}
