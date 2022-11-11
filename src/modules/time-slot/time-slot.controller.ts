import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { TimeSlotDocument } from './time-slot.model';
import { BookTimeSlotDto, CreateTimeSlotDto } from './dto';
import { AuthGuard, RoleGuard } from '../auth/guards';
import { UserRoles } from '../../constants';
import { User } from '../auth/decorators';
import { UserDocument } from '../auth/user.model';

@Controller('time-slot')
export class TimeSlotController {
  constructor(private readonly _timeSlotService: TimeSlotService) {}

  @UseGuards(RoleGuard(UserRoles.DOCTOR))
  @UseGuards(AuthGuard)
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreate(
    @Body() body: CreateTimeSlotDto,
    @User() doctor: UserDocument,
  ): Promise<TimeSlotDocument[]> {
    return this._timeSlotService.bulkCreate(doctor, body.dates);
  }

  @UseGuards(RoleGuard(UserRoles.CLIENT))
  @UseGuards(AuthGuard)
  @Patch('/book')
  @HttpCode(HttpStatus.NO_CONTENT)
  async book(
    @User() client: UserDocument,
    @Body() body: BookTimeSlotDto,
  ): Promise<void> {
    return this._timeSlotService.book(client, body.timeSlotId);
  }
}
