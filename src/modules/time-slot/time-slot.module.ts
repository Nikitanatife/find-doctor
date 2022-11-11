import { Module } from '@nestjs/common';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from '../../constants';
import { TimeSlotSchema } from './time-slot.model';
import { UserSchema } from '../auth/user.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  imports: [
    MongooseModule.forFeature([
      { name: modelNames.timeSlot, schema: TimeSlotSchema },
      { name: modelNames.user, schema: UserSchema },
    ]),
    AuthModule,
  ],
})
export class TimeSlotModule {}
