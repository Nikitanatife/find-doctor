import { IsMongoId, IsNotEmpty } from 'class-validator';

export class BookTimeSlotDto {
  @IsMongoId()
  @IsNotEmpty()
  timeSlotId: string;
}
