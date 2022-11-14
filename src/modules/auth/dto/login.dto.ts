import { IsNotEmpty, IsPhoneNumber, Length, Matches } from 'class-validator';
import {
  NOT_VALID_CREDENTIALS,
  PASSWORD_REG_EX,
  validationOptions,
} from '../../../constants';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsPhoneNumber(null, { message: NOT_VALID_CREDENTIALS })
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(PASSWORD_REG_EX, {
    message: NOT_VALID_CREDENTIALS,
  })
  @Length(
    validationOptions.minPasswordLength,
    validationOptions.maxStringFieldLength,
    { message: NOT_VALID_CREDENTIALS },
  )
  readonly password: string;
}
