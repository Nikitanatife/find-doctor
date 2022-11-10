import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  NOT_VALID_PASSWORD,
  NOT_VALID_PHONE_NUMBER,
  PASSWORD_REG_EX,
  PHONE_NUMBER_REG_EX,
} from '../../constants';
import { modelNames, UserRoles } from '../../constants';

@Schema({ versionKey: false, collection: modelNames.user, timestamps: true })
export class UserModel {
  @Prop({ required: true, trim: true })
  name: string;

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

  @Prop({ required: false, trim: true })
  token: string;

  @Prop({ required: true, enum: UserRoles })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

export type UserDocument = UserModel & Document;
