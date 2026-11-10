import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as packageJson from "../../package.json";

const DEFAULT_SWAGGER_PREFIX = "v1/docs";

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle("Martech Oneway Reports Data Service")
    .setDescription(
      "API documentation for the Martech Oneway Reports Data Service",
    )
    .setVersion(packageJson.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const path = process.env.SWAGGER_PREFIX || DEFAULT_SWAGGER_PREFIX;

  SwaggerModule.setup(path, app, document);
};
