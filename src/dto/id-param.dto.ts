import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
