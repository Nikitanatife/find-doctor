import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  BaseModel,
  NOT_VALID_PASSWORD,
  NOT_VALID_PHONE_NUMBER,
  PASSWORD_REG_EX,
  PHONE_NUMBER_REG_EX,
} from '../../constants';
import { modelNames, UserRoles } from '../../constants';
import { TimeSlotModel } from '../time-slot/time-slot.model';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false, collection: modelNames.user, timestamps: true })
export class UserModel extends BaseModel {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty()
  @Prop({
    required: true,
    trim: true,
    unique: true,
    match: [PHONE_NUMBER_REG_EX, NOT_VALID_PHONE_NUMBER],
  })
  phone: string;

  @Prop({
    required: true,
    trim: true,
    match: [PASSWORD_REG_EX, NOT_VALID_PASSWORD],
  })
  password: string;

  @ApiProperty({ required: false })
  @Prop({ required: false, trim: true })
  token?: string;

  @ApiProperty()
  @Prop({ required: true, enum: UserRoles })
  role: UserRoles;

  @ApiProperty({ required: false })
  @Prop({ required: false, trim: true })
  spec?: string;

  @ApiProperty({ type: () => TimeSlotModel, isArray: true })
  @Prop({
    type: [{ type: Types.ObjectId, ref: modelNames.timeSlot }],
    required: false,
  })
  timeSlots?: TimeSlotModel[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

export type UserDocument = UserModel & Document;
