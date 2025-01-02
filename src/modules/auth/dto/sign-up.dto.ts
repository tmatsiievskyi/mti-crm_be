import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsPasswordMatch } from 'src/libs/decorators';

export class SignUpDto {
  @IsString({ message: 'email should be a string' })
  @IsEmail({}, { message: 'Wrong email format' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString({ message: 'password should be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(7, { message: 'password should have atleast 7 characters' })
  password: string;

  @IsString({ message: 'passwordConfirm should be a string' })
  @IsNotEmpty({ message: 'passwordConfirm is required' })
  @MinLength(7, {
    message: 'passwordConfirm should have atleast 7 characters',
  })
  @Validate(IsPasswordMatch, {
    message: 'Passwords do not match',
  })
  passwordConfirm: string;

  @IsString({ message: 'firstName should be a string' })
  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @IsString({ message: 'lastName should be a string' })
  @IsNotEmpty({ message: 'lastName is required' })
  lastName: string;
}
