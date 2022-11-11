import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  modelNames,
  TIME_SLOT_CONFLICT,
  TIME_SLOT_NOT_FOUND,
  UNKNOWN_ACTION,
  UserActions,
} from '../../constants';
import { Model } from 'mongoose';
import { TimeSlotDocument } from './time-slot.model';
import { UserDocument } from '../auth/user.model';
import { UpdateTimeSlotDto } from './dto';

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

  async update(
    client: UserDocument,
    { timeSlotId, action }: UpdateTimeSlotDto,
  ): Promise<void> {
    let filter, fieldsToUpdate;

    switch (action) {
      case UserActions.BOOK:
        filter = { _id: timeSlotId, client: { $exists: false } };
        fieldsToUpdate = { client: client.id };
        break;
      case UserActions.CANCEL:
        filter = { _id: timeSlotId, client: client.id };
        fieldsToUpdate = { $unset: { client: 1 } };
        break;
      default:
        throw new HttpException(
          { error: UNKNOWN_ACTION },
          HttpStatus.BAD_REQUEST,
        );
    }

    const timeSlot = await this._timeSlotModel.findOneAndUpdate(
      filter,
      fieldsToUpdate,
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
