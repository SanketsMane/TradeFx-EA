import { Module } from '@nestjs/common';
import { SuperAdminSeeder } from './super-admin.seeder';
import { BrokerOffersSeeder } from './broker-offers.seeder';

@Module({
  providers: [SuperAdminSeeder, BrokerOffersSeeder],
})
export class SeedModule {}
