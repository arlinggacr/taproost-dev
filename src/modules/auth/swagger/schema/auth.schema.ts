import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum, User } from "../../../../../libs/common/src/entity/index";

export class LoginDto {
  @ApiProperty({ example: "john.doe@example.com" })
  email: string;

  @ApiProperty({ example: "securePassword123" })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: "John Doe" })
  name: string;

  @ApiProperty({ example: "john.doe@example.com" })
  email: string;

  @ApiProperty({ example: "johndoe" })
  username: string;

  @ApiProperty({ example: "securePassword123" })
  password: string;

  @ApiProperty({
    enum: RoleEnum,
    isArray: true,
    example: [RoleEnum.USER],
    required: false,
  })
  roles?: RoleEnum[];
}

export class TokenResponseSchema {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  accessToken: string;

  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  refreshToken: string;
}

export class RegisterResponseSchema extends User {}

export class ProfileResponseSchema extends User {}

export class ErrorResponseSchema {
  @ApiProperty({ example: false })
  isSuccess: boolean;

  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: "Unauthorized" })
  message: string;
}
