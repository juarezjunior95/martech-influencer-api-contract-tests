"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("newrelic");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const nest_winston_1 = require("nest-winston");
const app_module_1 = require("./app.module");
const swagger_config_1 = require("./config/swagger.config");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const port = parseInt(process.env.APP_PORT || "8080", 10);
const logger = new common_1.Logger("Bootstrap");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    app.set("query parser", "extended");
    app.useBodyParser("json", { limit: "30mb" });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        enableDebugMessages: true,
        forbidUnknownValues: false,
        validateCustomDecorators: true,
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.enableCors();
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: "1",
        prefix: "v",
    });
    (0, swagger_config_1.setupSwagger)(app);
    await app.listen(port, "0.0.0.0");
    logger.log(`Application is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map