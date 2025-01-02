import { CustomException } from '@common/exceptions';
import { EMessageCodes, EPrismaErrorCodes } from '@common/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export abstract class ServiceCore {
  handleError(error: unknown) {
    if (error instanceof CustomException) {
      throw new HttpException(
        {
          success: false,
          error: {
            message: error.message,
            messageCode: error.messageCode,
            statusCode: error.statusCode,
          },
        },
        error.statusCode,
      );
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === EPrismaErrorCodes.UNIQUE_VIOLATION) {
        throw new HttpException(
          {
            succcess: false,
            error: {
              message: error.message,
              messageCode: EMessageCodes.EMAIL_ALREADY_TAKEN,
              statusCode: HttpStatus.CONFLICT,
            },
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    throw error;
  }
}
