import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthPayload, CurrentUser } from '../common/decorators/current-user.decorator';
import { BrokersService } from './brokers.service';
import { CreateBrokerDto, UpdateBrokerDto } from './dto/broker.dto';

/** Partner brokers shown on the customer portal. Staff-only; writes are super-admin. */
@Controller('brokers')
export class BrokersController {
  constructor(private readonly brokers: BrokersService) {}

  @Get()
  list() {
    return this.brokers.findAll();
  }

  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() dto: CreateBrokerDto, @CurrentUser() actor: AuthPayload) {
    return this.brokers.create(dto, actor);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBrokerDto, @CurrentUser() actor: AuthPayload) {
    return this.brokers.update(id, dto, actor);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthPayload) {
    return this.brokers.remove(id, actor);
  }
}
