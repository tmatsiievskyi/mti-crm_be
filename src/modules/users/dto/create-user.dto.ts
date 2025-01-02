import { EAuthMethod } from '@prisma/client';
import { SignUpDto } from 'src/modules/auth/dto';

export class CreateUserDto extends SignUpDto {
  method: EAuthMethod;
}
