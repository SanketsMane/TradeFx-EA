import { IsEmail, IsIn, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { PRODUCT_SLUGS, SERVICE_SLUGS } from '../../common/catalog';

export class CreateQuoteDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @IsOptional()
  @IsIn(PRODUCT_SLUGS)
  productSlug?: string;

  @IsOptional()
  @IsIn(SERVICE_SLUGS as unknown as string[])
  serviceSlug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  broker?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  accountSize?: string;

  @IsString()
  @Length(1, 4000)
  message!: string;
}
