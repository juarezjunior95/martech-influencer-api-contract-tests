"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
const DEFAULT_SWAGGER_PREFIX = "v1/docs";
const setupSwagger = (app) => {
    const options = new swagger_1.DocumentBuilder()
        .setTitle("Influencer-Reputation-API")
        .setDescription("Essa API é responsável por gerenciar as analises de reputação de influencers")
        .setVersion("1.0.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    const path = process.env.SWAGGER_PREFIX ?? DEFAULT_SWAGGER_PREFIX;
    swagger_1.SwaggerModule.setup(path, app, document);
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.config.js.map