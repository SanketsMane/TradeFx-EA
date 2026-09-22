import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Paging for the trade statement.
 *
 * Bound with `@Query()` rather than `@Query('limit', ParseIntPipe)`: the global
 * ValidationPipe coerces a *named* numeric query param before any pipe sees it,
 * so an absent `?limit` arrives as `+undefined` — NaN — and ParseIntPipe then
 * rejects the whole request. Binding the object skips that coercion and lets
 * class-validator report a real range error instead.
 */
export class StatementQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
