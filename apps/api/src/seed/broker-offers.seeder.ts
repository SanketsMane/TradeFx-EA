import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Seeds the partner broker shown on the portal's "Open a broker account"
 * page, so the page is never empty on a fresh install.
 *
 * The affiliate URL comes from the environment because it carries our
 * referral parameters and differs per deployment. Without it we seed nothing
 * — an "Open an account" button pointing at a placeholder would send real
 * customers somewhere useless. Edit the row afterwards; the seeder only ever
 * creates, never overwrites.
 */
@Injectable()
export class BrokerOffersSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(BrokerOffersSeeder.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const signupUrl = this.config.get<string>('BROKER_AFFILIATE_URL');
    if (!signupUrl) {
      this.logger.warn(
        'BROKER_AFFILIATE_URL not set — skipping broker seed. The portal broker page will be empty.',
      );
      return;
    }

    const count = await this.prisma.brokerOffer.count();
    if (count > 0) return;

    const name = this.config.get<string>('BROKER_AFFILIATE_NAME') ?? 'Partner Broker';
    await this.prisma.brokerOffer.create({
      data: {
        name,
        signupUrl,
        blurb:
          'Our partner for new accounts. MT4 and MT5, hedging enabled, and we can support the account directly because we can see it on our side.',
        highlights: [
          'MT4 and MT5, hedging enabled',
          'Accounts usually approved same day',
          'Works with every TradeFx Expert Advisor',
          'We can assist with setup directly',
        ],
      },
    });
    this.logger.log(`Seeded partner broker "${name}".`);
  }
}
