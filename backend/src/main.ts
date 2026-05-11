import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function getAllowedOrigins() {
  const configuredOrigin = process.env.FRONTEND_ORIGIN;

  if (!configuredOrigin) {
    return [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:4000',
      'http://127.0.0.1:4000',
    ];
  }

  return configuredOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: getAllowedOrigins(),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
