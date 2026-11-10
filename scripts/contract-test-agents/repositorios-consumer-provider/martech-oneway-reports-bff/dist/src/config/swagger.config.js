"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
const packageJson = __importStar(require("../../package.json"));
const DEFAULT_SWAGGER_ROUTE = "v1/docs";
const BEARER_AUTH_NAME = "bearer";
const setupSwagger = (app) => {
    const builder = new swagger_1.DocumentBuilder()
        .setTitle("Martech Oneway Reports BFF Service")
        .setDescription("API documentation for the Martech Oneway Reports BFF Service")
        .setVersion(packageJson.version)
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
    }, BEARER_AUTH_NAME);
    const basePath = process.env.SWAGGER_BASE_PATH;
    if (basePath) {
        builder.addServer(basePath);
    }
    const options = builder.build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    for (const pathItem of Object.values(document.paths)) {
        for (const operation of Object.values(pathItem)) {
            if (operation &&
                typeof operation === "object" &&
                "responses" in operation) {
                operation.security = [{ [BEARER_AUTH_NAME]: [] }];
            }
        }
    }
    const path = process.env.SWAGGER_ROUTE || DEFAULT_SWAGGER_ROUTE;
    swagger_1.SwaggerModule.setup(path, app, document);
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.config.js.map