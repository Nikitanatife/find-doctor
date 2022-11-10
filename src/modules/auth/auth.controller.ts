import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { UserDocument } from './user.model';
import { AuthGuard } from './auth.guard';
import { User } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto): Promise<UserDocument> {
    return this._authService.register(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<UserDocument> {
    return this._authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@User() user: UserDocument): Promise<void> {
    return this._authService.logout(user);
  }
}
