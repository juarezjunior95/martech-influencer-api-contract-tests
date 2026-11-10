import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as packageJson from "../../package.json";

const DEFAULT_SWAGGER_ROUTE = "v1/docs";

const BEARER_AUTH_NAME = "bearer";

export const setupSwagger = (app: INestApplication) => {
  const builder = new DocumentBuilder()
    .setTitle("Martech Oneway Reports BFF Service")
    .setDescription(
      "API documentation for the Martech Oneway Reports BFF Service",
    )
    .setVersion(packageJson.version)
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      BEARER_AUTH_NAME,
    );

  const basePath = process.env.SWAGGER_BASE_PATH;
  if (basePath) {
    builder.addServer(basePath);
  }

  const options = builder.build();

  const document = SwaggerModule.createDocument(app, options);

  for (const pathItem of Object.values(document.paths)) {
    for (const operation of Object.values(pathItem)) {
      if (
        operation &&
        typeof operation === "object" &&
        "responses" in operation
      ) {
        operation.security = [{ [BEARER_AUTH_NAME]: [] }];
      }
    }
  }

  const path = process.env.SWAGGER_ROUTE || DEFAULT_SWAGGER_ROUTE;

  SwaggerModule.setup(path, app, document);
};
