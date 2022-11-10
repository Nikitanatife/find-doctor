import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './user.model';
import { modelNames, PHONE_EXIST } from '../../constants';
import { RegisterDto } from './dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(modelNames.user)
    private readonly _userModel: Model<UserDocument>,
  ) {}

  async register({
    password,
    phone,
    name,
    role,
  }: RegisterDto): Promise<UserDocument> {
    const user = await this._userModel.findOne({ phone });

    if (user) {
      throw new HttpException({ error: PHONE_EXIST }, HttpStatus.CONFLICT);
    }

    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    const newUser = await this._userModel.create({
      phone,
      password: passwordHash,
      name,
      role,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: omitPassword, ...userData } = newUser.toObject();

    return userData as UserDocument;
  }
}
