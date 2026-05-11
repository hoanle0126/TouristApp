import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function isValidDateOnly(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

@ValidatorConstraint({ name: 'isValidDateOnly', async: false })
class IsValidDateOnlyConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    return isValidDateOnly(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid date in YYYY-MM-DD format`;
  }
}

export function IsValidDateOnly(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateOnlyConstraint,
    });
  };
}
