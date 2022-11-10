import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { modelNames } from '../../constants';
import { Model } from 'mongoose';
import { UserDocument } from './user.model';
import { AuthDto } from './dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    @InjectModel(modelNames.user)
    private readonly _userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const autHeader = req.headers.authorization || '';
    const [bearer, token] = autHeader.split(' ');

    try {
      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(
          { error: 'Unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const { userId }: AuthDto = this._jwtService.verify(token);
      const user = await this._userModel.findById(userId);

      if (!user || !user.token || token !== user.token) {
        throw new HttpException(
          { error: 'Unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      req.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
