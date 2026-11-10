import "newrelic";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { setupSwagger } from "@config/swagger.config";
import { GlobalExceptionFilter } from "@common/filters/global-exception.filter";

const port: number = parseInt(process.env.APP_PORT || "8080", 10);
const logger = new Logger("Bootstrap");

/**
 * Bootstrap function to initialize and start the NestJS application.
 * Sets up global pipes, filters, interceptors, CORS, versioning, and Swagger documentation.
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Configure Express query parser to support nested objects (Express v5 compatibility)
  app.set("query parser", "extended");

  // Global validation pipe for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
      forbidUnknownValues: false,
      validateCustomDecorators: true,
    }),
  );

  // Global exception filter for handling all exceptions
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable CORS for cross-origin requests
  app.enableCors();

  // Enable URI versioning (e.g., /v1/endpoint)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
    prefix: "v",
  });

  // Setup Swagger documentation
  setupSwagger(app);

  // Start the application
  await app.listen(port, "0.0.0.0");

  logger.log(`Application is running on port ${port}`);
}

bootstrap();
