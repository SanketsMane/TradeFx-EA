import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { QuoteStatus, Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthPayload, CurrentUser } from '../common/decorators/current-user.decorator';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotes: QuotesService) {}

  /** Open to logged-out visitors — the quote form is on the public site. */
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  submit(@Body() dto: CreateQuoteDto) {
    return this.quotes.submit(dto);
  }

  @Roles(Role.CUSTOMER)
  @Get('mine')
  mine(@CurrentUser() user: AuthPayload) {
    return this.quotes.findMine(user);
  }

  // Staff inbox — no @Roles needed, the guard is staff-only by default.
  @Get()
  list(@Query('status') status?: QuoteStatus) {
    return this.quotes.findAll(status);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuoteDto,
    @CurrentUser() user: AuthPayload,
  ) {
    return this.quotes.update(id, dto, user);
  }
}
