import { RoleEnum } from '@app/common/entity';
import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from 'src/constant';

export const AllowRoles = (...roles: RoleEnum[]) =>
  SetMetadata(ROLE_KEY, roles);
