import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserActions } from '../../../constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTimeSlotDto {
  @ApiProperty()
  @IsEnum(UserActions)
  @IsNotEmpty()
  action: UserActions;
}
