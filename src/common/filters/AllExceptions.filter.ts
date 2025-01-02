import { CustomException } from '@common/exceptions';
import { EMessageCodes } from '@common/types';
import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResp: any = {
      success: false,
      error: {
        message: 'An unexpected error occurred.',
        messageCode: EMessageCodes.INTERNAL_SERVER_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResp = { success: false, error: exception.getResponse() };
    } else if (exception instanceof CustomException) {
      status = HttpStatus.BAD_REQUEST;
      errorResp = {
        success: false,
        error: {
          message: exception.message,
          messageCode: exception.messageCode,
          statusCode: exception.statusCode,
        },
      };
    }

    if (process.env.NODE_ENV !== 'production') {
      if (exception instanceof Error) {
        errorResp.error.stack = exception.stack;
      }
    }

    console.log(exception); //TODO add logger

    response.status(status).json(errorResp);
  }
}
