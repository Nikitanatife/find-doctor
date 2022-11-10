import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './user.model';
import {
  modelNames,
  NOT_VALID_CREDENTIALS,
  PHONE_EXIST,
} from '../../constants';
import { RegisterDto, LoginDto } from './dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(modelNames.user)
    private readonly _userModel: Model<UserDocument>,
    private readonly _jwtService: JwtService,
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

  async login({ password, phone }: LoginDto): Promise<UserDocument> {
    const user = await this._userModel.findOne({ phone });

    if (!user) {
      throw new HttpException(
        { error: NOT_VALID_CREDENTIALS },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException(
        { error: NOT_VALID_CREDENTIALS },
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this._jwtService.sign({ userId: user.id });

    const updatedUser = await this._userModel.findByIdAndUpdate(
      user.id,
      { token },
      { new: true },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: omitPassword, ...userData } = updatedUser.toObject();

    return userData as UserDocument;
  }

  async logout(user: UserDocument): Promise<void> {
    await this._userModel.findByIdAndUpdate(user.id, { token: null });
  }
}
