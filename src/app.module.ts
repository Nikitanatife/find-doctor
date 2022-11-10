import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from './config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(configService.getMongoDbConfig()),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
