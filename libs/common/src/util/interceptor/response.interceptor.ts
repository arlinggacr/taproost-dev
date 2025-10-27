import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Observable, map } from "rxjs";
import { MethodLogger } from "../../util/method-logger";

interface ResponseSchema<T> {
  isSuccess: boolean;
  statusCode: number;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseSchema<T>>
{
  logger: Logger;

  constructor() {
    this.logger = new Logger(ResponseInterceptor.name);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ResponseSchema<T>> {
    this.logger.log(MethodLogger.Service("Execute ResponseInterceptor"));
    const response = context.switchToHttp().getResponse<FastifyReply>();
    return next.handle().pipe(
      map((data) => ({
        isSuccess: true,
        data,
        statusCode: response.statusCode,
      }))
    );
  }
}
