import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthPayload, CurrentUser } from '../common/decorators/current-user.decorator';
import { PortalService } from './portal.service';
import { LinkAccountDto } from './dto/link-account.dto';
import { StatementQueryDto } from './dto/statement-query.dto';

/**
 * Everything the customer portal calls. Customer-only by design: staff use
 * the admin dashboard, and every query here is scoped to the caller's own id,
 * so one client can never read another's licences, accounts or trades.
 */
@Roles(Role.CUSTOMER)
@Controller('portal')
export class PortalController {
  constructor(private readonly portal: PortalService) {}

  @Get('overview')
  overview(@CurrentUser() user: AuthPayload) {
    return this.portal.overview(user);
  }

  @Get('licenses')
  licenses(@CurrentUser() user: AuthPayload) {
    return this.portal.listLicenses(user);
  }

  @Get('licenses/:id')
  license(@Param('id') id: string, @CurrentUser() user: AuthPayload) {
    return this.portal.getLicense(id, user);
  }

  @Get('licenses/:id/performance')
  performance(@Param('id') id: string, @CurrentUser() user: AuthPayload) {
    return this.portal.performance(id, user);
  }

  @Get('licenses/:id/statement')
  statement(
    @Param('id') id: string,
    @CurrentUser() user: AuthPayload,
    @Query() q: StatementQueryDto,
  ) {
    return this.portal.statement(id, user, q.limit ?? 100, q.offset ?? 0);
  }

  @Get('accounts')
  accounts(@CurrentUser() user: AuthPayload) {
    return this.portal.listAccounts(user);
  }

  @Post('accounts')
  @HttpCode(HttpStatus.CREATED)
  linkAccount(@Body() dto: LinkAccountDto, @CurrentUser() user: AuthPayload) {
    return this.portal.linkAccount(dto, user);
  }

  @Delete('accounts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  unlinkAccount(@Param('id') id: string, @CurrentUser() user: AuthPayload) {
    return this.portal.unlinkAccount(id, user);
  }

  @Get('brokers')
  brokers() {
    return this.portal.listBrokers();
  }
}
