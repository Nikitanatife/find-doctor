import { ArrayMinSize, IsArray, MinDate, MaxDate } from 'class-validator';
import { validationOptions } from '../../../constants';
import * as dayjs from 'dayjs';
import { Type } from 'class-transformer';

export class CreateTimeSlotDto {
  @IsArray()
  @ArrayMinSize(validationOptions.minArraySize)
  @MaxDate(dayjs().add(1, 'month').toDate(), { each: true })
  @MinDate(dayjs().toDate(), { each: true })
  @Type(() => Date)
  dates: Date[];
}
