import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseFormDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.body) {
      for (const key in request.body) {
        try {
          request.body[key] = JSON.parse(request.body[key]);
        } catch (e) {
          // If it's not a JSON string, keep the original value
          if (key === 'estimated_time' || key === 'promo') {
            request.body[key] = Number(request.body[key]);
          }
        }
      }
    }
    return next.handle();
  }
}
