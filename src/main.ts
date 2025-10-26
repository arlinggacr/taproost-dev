/* eslint-disable @typescript-eslint/no-var-requires */
import cors from "@fastify/cors";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({})
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("taproost-service")
    .setDescription(
      "TapRoost Service For Handling data and any logic business in here."
    )
    .setVersion("0.0.1")
    .setLicense("taproost.cc", "https://github.com/taproost")
    .addBearerAuth(
      {
        type: "http",
      },
      "access-token"
    )
    .build();

  const configService = app.get(ConfigService);
  const logger = new Logger();

  await app.register(require("@fastify/cookie"));
  await app.register(require("@fastify/multipart"));

  // Global Settings
  app.setGlobalPrefix("/v1/api");
  await app.register(cors, {
    origin: "*",
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger

  if (process.env.NODE_ENV !== "production") {
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, swaggerDocument);
  }

  const port =
    configService.get<number>("PORT") || parseInt(process.env.PORT) || 8080;

  await app.listen(port, "0.0.0.0", (_, addr) =>
    logger.log(`Server running at ${addr}`)
  );
}
bootstrap();
