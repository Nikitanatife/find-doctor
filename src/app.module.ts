import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { TimeSlotModule } from './modules/time-slot/time-slot.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot(configService.getMongoDbConfig()),
    ScheduleModule.forRoot(),
    AuthModule,
    TimeSlotModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
