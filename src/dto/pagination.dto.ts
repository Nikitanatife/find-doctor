import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  skip: number;
}
