import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthPayload, CurrentUser } from '../common/decorators/current-user.decorator';
import { LicensesService } from './licenses.service';
import { IssueLicenseDto } from './dto/issue-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';

/** Staff-only by default — the guard denies CUSTOMER unless a route opts in. */
@Controller('licenses')
export class LicensesController {
  constructor(private readonly licenses: LicensesService) {}

  @Post()
  issue(@Body() dto: IssueLicenseDto, @CurrentUser() user: AuthPayload) {
    return this.licenses.issue(dto, user);
  }

  @Get()
  list(@Query('userId') userId?: string) {
    return this.licenses.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLicenseDto,
    @CurrentUser() user: AuthPayload,
  ) {
    return this.licenses.update(id, dto, user);
  }
}
