import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IdParamDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
