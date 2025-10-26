/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiResponseBody } from "@app/common/swagger/decorator/response-body.schema";
import { ResponseInterceptor } from "@app/common/util/interceptor/response.interceptor";
import { MethodLogger } from "@app/common/util/method-logger";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  Res,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FindEmailDto } from "../dto/find-email.dto";
import { LoginDto, RefreshDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { AuthService } from "../service/auth.service";
import { TokenResponseSchema } from "../swagger/schema/auth.schema";

@Controller("auth")
@ApiTags("Authentication")
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  jwtService: any;
  configService: any;

  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user account" })
  @ApiBody({ type: RegisterDto })
  @ApiResponseBody({
    status: HttpStatus.CREATED,
    description: "User registration successful",
  })
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(MethodLogger.Controller(this.register.name));
    return await this.authService.register(
      registerDto.name,
      registerDto.email,
      registerDto.username,
      registerDto.password,
      registerDto.roles
    );
  }

  @Get("find-email")
  @ApiOperation({ summary: "Finding Your own Email" })
  @ApiQuery({ type: FindEmailDto })
  @ApiResponseBody({
    status: HttpStatus.OK,
    description: "Email Found Successfully",
  })
  async findEmail(@Query() findEmailDto: FindEmailDto) {
    this.logger.log(MethodLogger.Controller(this.findEmail.name));
    return await this.authService.findEmail(
      findEmailDto.email,
      findEmailDto.username
    );
  }

  @Post("login")
  @ApiOperation({ summary: "Authenticate user and get access tokens" })
  @ApiBody({ type: LoginDto })
  @ApiResponseBody({
    type: TokenResponseSchema,
    status: HttpStatus.OK,
    description: "Authentication successful",
  })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) _res) {
    this.logger.log(MethodLogger.Controller(this.login.name));
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password
    );

    const tokens = await this.authService.login(user);

    // res.cookie('SERVER_AUTHORIZATION', tokens.accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'dev',
    //   sameSite: 'strict',
    //   path: '/',
    // });

    return tokens;
  }

  @Post("refresh")
  async refresh(@Body() { refreshToken }: RefreshDto) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Post("verify-otp")
  @ApiOperation({ summary: "Verify OTP for email confirmation" })
  async verifyOtp(@Body() { email, otp }: { email: string; otp: string }) {
    this.logger.log(MethodLogger.Controller(this.verifyOtp.name));
    return await this.authService.validateUserAfterOtp(email, otp);
  }

  @Post("resend-otp")
  @ApiOperation({ summary: "Resend OTP for email verification" })
  async resendOtp(@Body() { email }: { email: string }) {
    this.logger.log(MethodLogger.Controller(this.resendOtp.name));
    return await this.authService.resendOtp(email);
  }
}
