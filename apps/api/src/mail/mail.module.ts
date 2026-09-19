import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ResendService } from './resend.service';

/**
 * Global so admin/monitoring flows can inject MailService without importing.
 * Depends on the (also global) SettingsService for SMTP config, and on
 * ResendService for the HTTP transport used when RESEND_API_KEY is set.
 */
@Global()
@Module({
  providers: [MailService, ResendService],
  exports: [MailService, ResendService],
})
export class MailModule {}
