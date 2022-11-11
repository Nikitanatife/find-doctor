import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { modelNames } from '../../constants';
import { Document, Types } from 'mongoose';
import { UserModel } from '../auth/user.model';

@Schema({
  versionKey: false,
  collection: modelNames.timeSlot,
  timestamps: true,
})
export class TimeSlotModel {
  @Prop({ required: false, type: Types.ObjectId, ref: modelNames.user })
  client?: UserModel;

  @Prop({ required: true, type: Types.ObjectId, ref: modelNames.user })
  doctor: UserModel;

  @Prop({ required: true })
  date: Date;
}

export const TimeSlotSchema = SchemaFactory.createForClass(TimeSlotModel);

export type TimeSlotDocument = TimeSlotModel & Document;
