import { Role, RoleEnum } from '@app/common/entity';
import { ParseExeption } from '@app/common/util/exceptions';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from '../../../constant';

@Injectable()
export class RoleGuard implements CanActivate {
  logger: Logger;

  constructor(private reflector: Reflector) {
    this.logger = new Logger(RoleGuard.name);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.log('Validate user role');

    try {
      const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
        ROLE_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles.length) {
        return true;
      }

      const { user } = context.switchToHttp().getRequest();

      return requiredRoles.some((role) =>
        user?.role.some((r: Role) => r.name === role),
      );
    } catch (e) {
      ParseExeption(e);
    }
  }
}
