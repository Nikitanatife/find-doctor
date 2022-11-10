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

export class RegisterDto {
  @IsNotEmpty()
  @Length(
    validationOptions.minStringFieldLength,
    validationOptions.maxStringFieldLength,
  )
  @Matches(USER_NAME_REG_EX, {
    message: NOT_VALID_NAME,
  })
  readonly name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REG_EX, {
    message: NOT_VALID_PASSWORD,
  })
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(UserRoles)
  readonly role: string;

  @IsSpecNotEmpty()
  @IsSpecAllowed()
  spec?: string;
}
