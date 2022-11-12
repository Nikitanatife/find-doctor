import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  modelNames,
  TIME_SLOT_CONFLICT,
  TIME_SLOT_NOT_FOUND,
  UNKNOWN_ACTION,
  UserActions,
} from '../../constants';
import { Model, Types } from 'mongoose';
import { TimeSlotDocument } from './time-slot.model';
import { UserDocument } from '../auth/user.model';
import { UpdateTimeSlotDto } from './dto';
import * as dayjs from 'dayjs';

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
      dates.map((date) => ({
        date: dayjs(date),
        doctor: new Types.ObjectId(doctor.id),
      })),
    );

    await this._userModel.findByIdAndUpdate(doctor.id, {
      $addToSet: { timeSlots: createdTimeSlots.map((t) => t.id) },
    });

    return createdTimeSlots;
  }

  async update(
    client: UserDocument,
    id: string,
    { action }: UpdateTimeSlotDto,
  ): Promise<void> {
    let filter, fieldsToUpdate;

    switch (action) {
      case UserActions.BOOK:
        filter = { id, client: { $exists: false } };
        fieldsToUpdate = { client: client.id };
        break;
      case UserActions.CANCEL:
        filter = { id, client: client.id };
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

  async delete(doctor: UserDocument, id: string): Promise<void> {
    const filter = {
      id,
      doctor: doctor.id,
    };
    const timeSlot = await this._timeSlotModel.findOne(filter);

    if (!timeSlot) {
      throw new HttpException(
        { error: TIME_SLOT_NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }

    await Promise.all([
      this._timeSlotModel.findOneAndDelete(filter),
      this._userModel.findByIdAndUpdate(doctor.id, {
        $pull: { timeSlots: id },
      }),
    ]);
  }
}
