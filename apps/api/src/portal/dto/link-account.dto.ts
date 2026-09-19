import { Platform } from '@prisma/client';
import { IsEnum, IsString, Length, Matches } from 'class-validator';
import { LICENSE_CODE_LENGTH } from '../../common/license-code';

export class LinkAccountDto {
  /** Accepts the grouped form (ABC-DEF-GHI) too; the service normalises it. */
  @IsString()
  @Length(LICENSE_CODE_LENGTH, LICENSE_CODE_LENGTH + 2)
  licenseCode!: string;

  @IsString()
  @Length(1, 60)
  label!: string;

  @IsString()
  @Matches(/^\d{4,20}$/, { message: 'login must be the numeric account number' })
  login!: string;

  @IsString()
  @Length(1, 200)
  password!: string;

  @IsString()
  @Length(1, 120)
  server!: string;

  @IsEnum(Platform)
  platform!: Platform;
}
