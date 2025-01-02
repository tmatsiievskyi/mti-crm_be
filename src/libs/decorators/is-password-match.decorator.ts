import {
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { SignUpDto } from 'src/modules/auth/dto';

@ValidatorConstraint({ name: 'IsPasswordMatch', async: false })
export class IsPasswordMatch implements ValidatorConstraintInterface {
  public validate(confirmPassword: string, args: ValidationArguments) {
    const obj = args.object as SignUpDto;
    const result = obj.password === confirmPassword;

    return result;
  }

  public defaultMessage(): string {
    return 'Passwords does not match';
  }
}
