import { Module } from "@nestjs/common";
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role, User, UserRole } from "../entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [NestConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          host: configService.get("DB_HOST"),
          port: configService.get("DB_PORT"),
          username: configService.get("DB_USERNAME"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get("DB_NAME"),
          type: "postgres",
          autoLoadEntities: true,
          entities: [User, UserRole, Role],
          logging: true,
          ssl: {
            rejectUnauthorized: false,
          },
          synchronize: configService.getOrThrow("STAGE") === "dev",
        };
      },
    }),
  ],
})
export class DatabaseModule {}
