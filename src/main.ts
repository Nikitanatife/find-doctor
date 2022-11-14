import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app
    .setGlobalPrefix('/api')
    .useGlobalPipes(new ValidationPipe(configService.getValidationOptions()));

  const port = configService.getPort();
  const options = new DocumentBuilder()
    .setTitle('Find Doctor API')
    .setDescription('Find Doctor API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(port, async () =>
    console.log(`Application is running on: ${await app.getUrl()}`),
  );
}
bootstrap();
