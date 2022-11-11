import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { TimeSlotDocument } from './time-slot.model';
import { UpdateTimeSlotDto, CreateTimeSlotDto } from './dto';
import { AuthGuard, RoleGuard } from '../auth/guards';
import { UserRoles } from '../../constants';
import { User } from '../auth/decorators';
import { UserDocument } from '../auth/user.model';
import { IdParamDto } from '../../dto';

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
  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @User() client: UserDocument,
    @Param() params: IdParamDto,
    @Body() body: UpdateTimeSlotDto,
  ): Promise<void> {
    return this._timeSlotService.update(client, params.id, body);
  }

  @UseGuards(RoleGuard(UserRoles.DOCTOR))
  @UseGuards(AuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param() params: IdParamDto,
    @User() doctor: UserDocument,
  ): Promise<void> {
    return this._timeSlotService.delete(doctor, params.id);
  }
}
