import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RoleEnum } from "../../../../libs/common/src/entity/index";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  roles?: RoleEnum[];
}
