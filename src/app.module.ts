import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { TimeSlotModule } from './modules/time-slot/time-slot.module';

@Module({
  imports: [
    MongooseModule.forRoot(configService.getMongoDbConfig()),
    AuthModule,
    TimeSlotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
