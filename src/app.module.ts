import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from './config';

@Module({
  imports: [MongooseModule.forRoot(configService.getMongoDbConfig())],
  controllers: [],
  providers: [],
})
export class AppModule {}
