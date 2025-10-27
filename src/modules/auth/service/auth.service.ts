import {
  Injectable,
  Logger,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { RoleEnum, User } from "../../../../libs/common/src/entity/index";
import { ParseException } from "../../../../libs/common/src/util/exceptions";
import { MethodLogger } from "../../../../libs/common/src/util/method-logger";
import { MailService } from "../../../helpers/mailer-service";
import { EmailUsername } from "../dto/find-email.dto";
import { JwtResponse } from "../interface/jwt-definition.interface";
import { AuthRepository } from "../repository/auth.repository";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  }

  async verifyOtp(email: string, otp: string) {
    const success = await this.authRepository.verifyOtp(email, otp);
    if (!success) throw new UnauthorizedException("Invalid or expired OTP");
    return { message: "Email verified successfully" };
  }

  async resendOtp(email: string) {
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.authRepository.resendOtp(email, otp, expiresAt);
    await this.mailService.sendOtp(email, otp);
    return { message: "OTP resent successfully" };
  }

  async validateUserAfterOtp(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.authRepository.validateUser(email, password);
    if (!user) throw new UnauthorizedException("Invalid email or password");
    if (!user.isVerified)
      throw new MethodNotAllowedException("Email not verified");
    return user;
  }

  async register(
    name: string,
    email: string,
    username: string,
    password: string,
    roles: string[] = ["USER"]
  ): Promise<User> {
    try {
      this.logger.log(MethodLogger.Service(this.register.name));

      const roleEnums: RoleEnum[] = roles.map((role) => {
        const upperRole = role.toUpperCase();
        if (upperRole in RoleEnum) {
          return RoleEnum[upperRole as keyof typeof RoleEnum];
        }
        return RoleEnum.USER;
      });

      const user = await this.authRepository.createUser(
        name,
        email,
        username,
        password,
        roleEnums
      );

      this.logger.log(`Successfully registered user ${username}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to register user ${username}`, error.stack);
      ParseException(error);
    }
  }

  async findEmail(email?: string, username?: string): Promise<EmailUsername> {
    try {
      this.logger.log(MethodLogger.Service(this.findEmail.name));

      // Check if at least one parameter is provided and not empty
      if (
        (!email || email.trim() === "") &&
        (!username || username.trim() === "")
      ) {
        this.logger.warn("Both email and username are empty or not provided");
      }

      const emailExist = await this.authRepository.findByUsernameOrEmail(
        username || "",
        email || ""
      );

      if (!emailExist) {
        this.logger.warn(
          `User not found with email: ${email || "N/A"}, username: ${
            username || "N/A"
          }`
        );
        throw new NotFoundException("User not found");
      }

      this.logger.log(
        `Successfully found user with email: ${email || "N/A"}, username: ${
          username || "N/A"
        }`
      );
      return { email: emailExist.email, username: emailExist.username };
    } catch (error) {
      this.logger.error(
        `Failed to find user with email: ${email || "N/A"}, username: ${
          username || "N/A"
        }`,
        error.stack
      );
      ParseException(error);
    }
  }

  async login(user: User): Promise<JwtResponse> {
    try {
      this.logger.log(MethodLogger.Service(this.login.name));

      const payload = {
        sub: user.userId,

        userId: user.userId,
        name: user.name,
        email: user.email,
        username: user.username,

        userRoles: user.userRole.map((role) => ({
          roleId: role.role?.roleId,
          roleName: role.role?.name,
        })),

        tokenType: "access",
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_ACCESS_SECRET_KEY"),
        expiresIn: "30m",
        algorithm: "HS256",
      });

      const refreshToken = this.jwtService.sign(
        {
          ...payload,
          tokenType: "refresh",
          jti: uuidv4(),
        },
        {
          secret: this.configService.get("JWT_REFRESH_SECRET_KEY"),
          expiresIn: "8h",
        }
      );

      this.logger.log(
        `Successfully generated tokens for user ${user.username}`
      );

      return {
        accessToken,
        refreshToken,
        expiresIn: 300,
        tokenType: "Bearer",
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate tokens for user ${user.username}`,
        error.stack
      );
      ParseException(error);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      this.logger.log(MethodLogger.Service(this.validateUser.name));

      const emailData = await this.authRepository.validateUser(email, password);

      if (!emailData) {
        this.logger.warn(`Validation failed for email ${email}`);
        throw new UnauthorizedException("Invalid email or password");
      }

      this.logger.log(`Successfully validated email ${email}`);
      return emailData;
    } catch (error) {
      this.logger.error(`Failed to validate user ${email}`, error.stack);
      ParseException(error);
    }
  }

  async refreshTokens(refreshToken: string): Promise<JwtResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET_KEY"),
      });

      const { tokenType, jti, iat, exp, ...restPayload } = payload;

      const newAccessToken = this.jwtService.sign(
        { ...restPayload, tokenType: "access" },
        {
          secret: this.configService.get("JWT_ACCESS_SECRET_KEY"),
          expiresIn: "8h",
        }
      );

      return {
        accessToken: newAccessToken,
        refreshToken: refreshToken,
        tokenType: "Bearer",
        expiresIn: 8 * 60 * 60, // in second
      };
    } catch (err) {
      this.logger.error(`Failed to refresh token`, err.stack);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
