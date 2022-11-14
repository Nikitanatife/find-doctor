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
import { TimeSlotDocument, TimeSlotModel } from './time-slot.model';
import { UpdateTimeSlotDto, CreateTimeSlotDto } from './dto';
import { AuthGuard, RoleGuard } from '../auth/guards';
import { UserRoles } from '../../constants';
import { User } from '../auth/decorators';
import { UserDocument } from '../auth/user.model';
import { IdParamDto } from '../../dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Time-Slot')
@ApiBearerAuth()
@Controller('time-slot')
export class TimeSlotController {
  constructor(private readonly _timeSlotService: TimeSlotService) {}

  @UseGuards(RoleGuard(UserRoles.DOCTOR))
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new time slots' })
  @ApiCreatedResponse({ type: TimeSlotModel, isArray: true })
  async bulkCreate(
    @User() doctor: UserDocument,
    @Body() body: CreateTimeSlotDto,
  ): Promise<TimeSlotDocument[]> {
    return this._timeSlotService.bulkCreate(doctor, body.dates);
  }

  @UseGuards(RoleGuard(UserRoles.CLIENT))
  @UseGuards(AuthGuard)
  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Book time slot or cansel consultation' })
  @ApiNoContentResponse()
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
  @ApiOperation({ summary: 'Delete time slot' })
  @ApiNoContentResponse()
  async delete(
    @Param() params: IdParamDto,
    @User() doctor: UserDocument,
  ): Promise<void> {
    return this._timeSlotService.delete(doctor, params.id);
  }
}
