import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class RequestOtpDto {
  /** Any common written form; the service normalises it. */
  @IsString()
  @Length(10, 20)
  phone!: string;
}

export class VerifyOtpDto {
  @IsString()
  @Length(10, 20)
  phone!: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'code must be the 6-digit number we texted you' })
  code!: string;

  /** Required only when the number has no account yet. */
  @IsOptional()
  @IsString()
  @Length(2, 120)
  fullName?: string;
}
