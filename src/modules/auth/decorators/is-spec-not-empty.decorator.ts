import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SPECIALIZATION_REQUIRED, UserRoles } from '../../../constants';

export function IsSpecNotEmpty(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsSpecNotEmptyConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsSpecNotEmptyConstraint' })
export class IsSpecNotEmptyConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments: ValidationArguments): boolean {
    const role = (validationArguments.object as { [key: string]: unknown })
      .role;

    if (role && role === UserRoles.DOCTOR && !value) {
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    return SPECIALIZATION_REQUIRED;
  }
}
