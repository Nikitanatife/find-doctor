import { ApiProperty } from '@nestjs/swagger';

export class BaseModel {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
