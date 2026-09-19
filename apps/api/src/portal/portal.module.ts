import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { CopiersModule } from '../copiers/copiers.module';
import { PortalController } from './portal.controller';
import { PortalService } from './portal.service';

@Module({
  imports: [AccountsModule, CopiersModule],
  controllers: [PortalController],
  providers: [PortalService],
})
export class PortalModule {}
