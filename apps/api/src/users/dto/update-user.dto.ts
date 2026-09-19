import { UserStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status!: UserStatus;

  /** Recorded in the audit log so a suspension is explainable later. */
  @IsOptional()
  @IsString()
  @MaxLength(300)
  reason?: string;
}

export class AdminResetPasswordDto {
  @IsString()
  @Length(8, 72)
  password!: string;
}
