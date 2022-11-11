import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { UserActions } from '../../../constants';

export class UpdateTimeSlotDto {
  @IsMongoId()
  @IsNotEmpty()
  timeSlotId: string;

  @IsEnum(UserActions)
  @IsNotEmpty()
  action: UserActions;
}
