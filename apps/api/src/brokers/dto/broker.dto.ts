import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateBrokerDto {
  @IsString()
  @Length(2, 80)
  name!: string;

  @IsString()
  @Length(10, 600)
  blurb!: string;

  /** The affiliate link. Must be absolute http(s) — a relative one would 404. */
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  signupUrl!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  highlights?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class UpdateBrokerDto extends CreateBrokerDto {
  @IsOptional()
  @IsString()
  @Length(2, 80)
  declare name: string;

  @IsOptional()
  @IsString()
  @Length(10, 600)
  declare blurb: string;

  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  declare signupUrl: string;
}
