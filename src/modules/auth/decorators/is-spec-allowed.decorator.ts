import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SPECIALIZATION_NOT_ALLOWED, UserRoles } from '../../../constants';

export function IsSpecAllowed(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsSpecAllowedConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsSpecAllowedConstraint' })
export class IsSpecAllowedConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments: ValidationArguments): boolean {
    const role = (validationArguments.object as { [key: string]: unknown })
      .role;

    return !(role && role !== UserRoles.DOCTOR && value);
  }

  defaultMessage(): string {
    return SPECIALIZATION_NOT_ALLOWED;
  }
}
