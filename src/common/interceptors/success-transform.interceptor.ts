import { TResponse } from '@common/types/app.types';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccessTransformInterceptor<T>
  implements NestInterceptor<T, TResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.success === false && data.error) {
          return data;
        }

        if (data && data.message && !data.data) {
          return { success: true, message: data.message };
        }

        return { success: true, data: data || [] };
      }),
    );
  }
}
