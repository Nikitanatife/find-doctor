import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = configService.getPort();
  await app
    .setGlobalPrefix('/api')
    .useGlobalPipes(new ValidationPipe(configService.getValidationOptions()))
    .listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
