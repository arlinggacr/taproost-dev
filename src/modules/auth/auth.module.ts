import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role, User, UserRole } from "../../../libs/common/src/entity/index";
import { ConfigModule, DatabaseModule } from "../../../libs/common/src/index";
import { MailService } from "../../helpers/mailer-service";
import { AuthController } from "./controllers/auth.controller";
import { JwtAccessGuard } from "./guard/jwt-access.guard";
import { AuthRepository } from "./repository/auth.repository";
import { AuthService } from "./service/auth.service";
import { JwtAccessStrategy } from "./strategy/jwt-access.service";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    TypeOrmModule.forFeature([User, UserRole, Role]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_SECRET_KEY"),
        signOptions: {
          expiresIn: configService.get("JWT_ACCESS_EXPIRED"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    MailService,
    AuthService,
    JwtAccessStrategy,
    JwtAccessGuard,
  ],
  exports: [MailService, AuthService, JwtAccessStrategy, JwtAccessGuard],
})
export class AuthModule {}
