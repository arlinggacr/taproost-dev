import { SetMetadata } from "@nestjs/common";
import { ROLE_KEY } from "src/constant";
import { RoleEnum } from "../../../../libs/common/src/entity/index";

export const AllowRoles = (...roles: RoleEnum[]) =>
  SetMetadata(ROLE_KEY, roles);
