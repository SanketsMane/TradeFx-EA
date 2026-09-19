import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import {
  AuthPayload,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { OtpService } from './otp.service';
import { RefreshDto } from './dto/refresh.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

// Sign-in, sessions and password changes belong to every account, customers
// included — the guard is staff-only unless a route says otherwise.
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CUSTOMER)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly otp: OtpService,
  ) {}

  // Brute-force guard: max 10 login attempts per minute per IP.
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto, @Ip() ip: string, @Headers('user-agent') ua?: string) {
    return this.auth.login(dto.email, dto.password, { ip, userAgent: ua });
  }

  // Self-service customer sign-up. Rate-limited so the table cannot be
  // flooded from one address.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto, @Ip() ip: string, @Headers('user-agent') ua?: string) {
    return this.auth.register(dto, { ip, userAgent: ua });
  }

  /*
   * Mobile sign-in. Both routes are public and tightly throttled: each send
   * costs real money and a code is a guessable secret, so the limits here are
   * stricter than anywhere else in the API.
   */
  @Throttle({ default: { limit: 5, ttl: 600_000 } })
  @Public()
  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  requestOtp(@Body() dto: RequestOtpDto, @Ip() ip: string) {
    return this.otp.request(dto.phone, { ip });
  }

  @Throttle({ default: { limit: 10, ttl: 600_000 } })
  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() dto: VerifyOtpDto, @Ip() ip: string, @Headers('user-agent') ua?: string) {
    return this.otp.verify(dto.phone, dto.code, dto.fullName, { ip, userAgent: ua });
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  // Rate-limited to blunt enumeration / mail-bombing. Always returns 204.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.auth.forgotPassword(dto.email);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.auth.resetPassword(dto.email, dto.token, dto.newPassword);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentUser() user: AuthPayload): Promise<void> {
    await this.auth.logout(user.sub, user.sid);
  }

  @Get('sessions')
  sessions(@CurrentUser() user: AuthPayload) {
    return this.auth.listSessions(user.sub, user.sid);
  }

  @Post('sessions/revoke-others')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeOthers(@CurrentUser() user: AuthPayload): Promise<void> {
    await this.auth.revokeOtherSessions(user.sub, user.sid);
  }

  @Delete('sessions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeSession(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthPayload,
  ): Promise<void> {
    await this.auth.revokeSession(user.sub, id);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.auth.changePassword(userId, dto.currentPassword, dto.newPassword);
  }

  @Get('me')
  me(@CurrentUser() user: AuthPayload) {
    return this.auth.me(user.sub);
  }
}
