import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthPayload, CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UserQueryDto } from './dto/user-query.dto';
import { AdminResetPasswordDto, UpdateUserStatusDto } from './dto/update-user.dto';

/**
 * Platform-wide user administration.
 *
 * Reading is open to any staff member; every mutating action is super-admin
 * only. Disabling or deleting an account can cut off a paying customer and
 * stop a live Expert Advisor, so it is not a routine-admin capability.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list(@Query() q: UserQueryDto) {
    return this.users.findAll(q);
  }

  @Get('stats')
  stats() {
    return this.users.stats();
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/status')
  setStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() actor: AuthPayload,
  ) {
    return this.users.setStatus(id, dto.status, actor, dto.reason);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post(':id/reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(
    @Param('id') id: string,
    @Body() dto: AdminResetPasswordDto,
    @CurrentUser() actor: AuthPayload,
  ) {
    return this.users.resetPassword(id, dto.password, actor);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post(':id/revoke-sessions')
  @HttpCode(HttpStatus.OK)
  revokeSessions(@Param('id') id: string, @CurrentUser() actor: AuthPayload) {
    return this.users.revokeSessions(id, actor);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthPayload) {
    return this.users.remove(id, actor);
  }
}
