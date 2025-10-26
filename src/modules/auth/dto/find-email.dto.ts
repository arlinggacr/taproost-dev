import { IsOptional, IsString } from "class-validator";

export class FindEmailDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;
}

export class EmailUsername {
  email: string;
  username: string;
}
