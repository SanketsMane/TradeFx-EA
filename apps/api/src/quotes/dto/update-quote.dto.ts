import { QuoteStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateQuoteDto {
  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;

  /**
   * What the advisor told the customer. Free text on purpose — the price
   * itself goes out by email, so no amount is ever rendered in the UI.
   */
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  quotedNote?: string;
}
