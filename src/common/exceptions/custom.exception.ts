import { EMessageCodes } from '@common/types';
import { HttpStatus } from '@nestjs/common';

export class CustomException extends Error {
  constructor(
    public readonly message: string | object | any,
    public readonly messageCode: EMessageCodes,
    public readonly statusCode: HttpStatus,
  ) {
    super(message);
  }
}
