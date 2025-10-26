import { MethodLogger } from '@app/common/util/method-logger';
import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

export function Serialize(dto: ClassConstructor<any>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  logger: Logger;

  constructor(private dto: any) {
    this.logger = new Logger(SerializeInterceptor.name);
  }

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    this.logger.log(MethodLogger.Service('Execute SerializeInterceptor'));

    return next.handle().pipe(
      map((data: any) =>
        plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
      ),
    );
  }
}
