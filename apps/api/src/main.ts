import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Security headers. API serves JSON only, so CSP/COEP defaults are safe.
  app.use(helmet());

  const config = app.get(ConfigService);

  // Lock CORS to configured origins in prod; reflect any origin in dev.
  const origins = config.get<string>('CORS_ORIGINS');
  app.enableCors({
    origin: origins ? origins.split(',').map((o) => o.trim()).filter(Boolean) : true,
    credentials: true,
  });

  // Trust the reverse proxy so throttling/logging see the real client IP.
  const http = app.getHttpAdapter().getInstance();
  if (typeof http.set === 'function') http.set('trust proxy', 1);

  // Drain DB pool / close connections cleanly on SIGTERM/SIGINT.
  app.enableShutdownHooks();

  const port = config.get<number>('API_PORT', 3000);

  /*
   * Bind to loopback in production. The API always sits behind nginx, so
   * listening on every interface only creates a second, unprotected way in —
   * no TLS and none of the proxy's security headers. A firewall should cover
   * that too, but this does not depend on one being configured correctly.
   * Dev keeps 0.0.0.0 so a phone on the same network can reach it.
   */
  const host = config.get<string>(
    'API_HOST',
    config.get<string>('NODE_ENV') === 'production' ? '127.0.0.1' : '0.0.0.0',
  );

  await app.listen(port, host);
  new Logger('Bootstrap').log(`API listening on http://${host}:${port}/api/v1`);
}

void bootstrap();
