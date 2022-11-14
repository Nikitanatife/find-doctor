import {
  IsPhoneNumber,
  IsNotEmpty,
  Length,
  Matches,
  IsEnum,
} from 'class-validator';
import {
  NOT_VALID_NAME,
  NOT_VALID_PASSWORD,
  PASSWORD_REG_EX,
  USER_NAME_REG_EX,
  validationOptions,
  UserRoles,
} from '../../../constants';
import { IsSpecAllowed, IsSpecNotEmpty } from '../decorators';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @Length(
    validationOptions.minStringFieldLength,
    validationOptions.maxStringFieldLength,
  )
  @Matches(USER_NAME_REG_EX, {
    message: NOT_VALID_NAME,
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty()
  @Matches(PASSWORD_REG_EX, {
    message: NOT_VALID_PASSWORD,
  })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsEnum(UserRoles)
  @IsNotEmpty()
  readonly role: string;

  @ApiProperty({ required: false })
  @IsSpecNotEmpty()
  @IsSpecAllowed()
  spec?: string;
}
