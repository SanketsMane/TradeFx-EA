import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(2, 120)
  fullName!: string;

  @IsEmail()
  email!: string;

  /**
   * 8–16 characters to match the sign-up form's own rule. The upper bound is
   * the product's choice, not a security one — argon2 handles any length.
   */
  @IsString()
  @Length(8, 16)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(/^[+()\d\s-]*$/, { message: 'phone must be a valid phone number' })
  phone?: string;
}
