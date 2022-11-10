import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = configService.getPort();
  await app.setGlobalPrefix('/api').listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
