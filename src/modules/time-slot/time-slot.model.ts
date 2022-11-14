import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, modelNames } from '../../constants';
import { Document, Types } from 'mongoose';
import { UserModel } from '../auth/user.model';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  versionKey: false,
  collection: modelNames.timeSlot,
  timestamps: true,
})
export class TimeSlotModel extends BaseModel {
  @ApiProperty({ required: false, type: () => UserModel })
  @Prop({ required: false, type: Types.ObjectId, ref: modelNames.user })
  client?: UserModel;

  @ApiProperty({ type: () => UserModel })
  @Prop({ required: true, type: Types.ObjectId, ref: modelNames.user })
  doctor: UserModel;

  @ApiProperty()
  @Prop({ required: true })
  date: Date;

  @ApiProperty({ default: false })
  @Prop({ required: true, default: false })
  isNotificationSentTomorrow: boolean;

  @ApiProperty({ default: false })
  @Prop({ required: true, default: false })
  isNotificationSentToday: boolean;
}

export const TimeSlotSchema = SchemaFactory.createForClass(TimeSlotModel);

export type TimeSlotDocument = TimeSlotModel & Document;
