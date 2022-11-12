import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from '../../constants';
import { TimeSlotSchema } from '../time-slot/time-slot.model';

@Module({
  providers: [NotificationService],
  imports: [
    MongooseModule.forFeature([
      { name: modelNames.timeSlot, schema: TimeSlotSchema },
    ]),
  ],
})
export class NotificationModule {}
