import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { UserDocument, UserModel } from './user.model';
import { AuthGuard } from './guards';
import { User } from './decorators';
import { PaginationDto } from '../../dto/pagination.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Get('/doctors')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get doctors list with time slots' })
  @ApiOkResponse({ type: UserModel, isArray: true })
  @ApiBearerAuth()
  async getDoctorList(@Query() query: PaginationDto): Promise<UserDocument[]> {
    return this._authService.getDoctorList(query);
  }

  @Post('/auth/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiCreatedResponse({ type: UserModel })
  async register(@Body() body: RegisterDto): Promise<UserDocument> {
    return this._authService.register(body);
  }

  @Post('/auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ type: UserModel })
  async login(@Body() body: LoginDto): Promise<UserDocument> {
    return this._authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('/auth/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'User logout' })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  async logout(@User() user: UserDocument): Promise<void> {
    return this._authService.logout(user);
  }
}
