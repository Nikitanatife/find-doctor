import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  modelNames,
  TIME_SLOT_CONFLICT,
  TIME_SLOT_NOT_FOUND,
} from '../../constants';
import { Model } from 'mongoose';
import { TimeSlotDocument } from './time-slot.model';
import { UserDocument } from '../auth/user.model';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectModel(modelNames.timeSlot)
    private readonly _timeSlotModel: Model<TimeSlotDocument>,
    @InjectModel(modelNames.user)
    private readonly _userModel: Model<UserDocument>,
  ) {}

  async bulkCreate(
    doctor: UserDocument,
    dates: Date[],
  ): Promise<TimeSlotDocument[]> {
    const timeSlot = await this._timeSlotModel.findOne({
      date: { $in: dates },
    });

    if (timeSlot) {
      throw new HttpException(
        { error: TIME_SLOT_CONFLICT },
        HttpStatus.CONFLICT,
      );
    }

    const createdTimeSlots = await this._timeSlotModel.create(
      dates.map((date) => ({ date, doctor: doctor.id })),
    );

    await this._userModel.findByIdAndUpdate(doctor.id, {
      $addToSet: { timeSlots: createdTimeSlots.map((t) => t.id) },
    });

    return createdTimeSlots;
  }

  async book(client: UserDocument, timeSlotId: string): Promise<void> {
    const timeSlot = await this._timeSlotModel.findOneAndUpdate(
      { _id: timeSlotId, client: { $exists: false } },
      {
        client: client.id,
      },
      { new: true },
    );

    if (!timeSlot) {
      throw new HttpException(
        { error: TIME_SLOT_NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
