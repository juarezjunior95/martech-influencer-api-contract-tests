import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const DEFAULT_SWAGGER_PREFIX = "v1/docs";

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle("Influencer-Reputation-API")
    .setDescription(
      "Essa API é responsável por gerenciar as analises de reputação de influencers",
    )
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const path = process.env.SWAGGER_PREFIX ?? DEFAULT_SWAGGER_PREFIX;

  SwaggerModule.setup(path, app, document);
};
