import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserActions } from '../../../constants';

export class UpdateTimeSlotDto {
  @IsEnum(UserActions)
  @IsNotEmpty()
  action: UserActions;
}
