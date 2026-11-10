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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FileLoaderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLoaderService = void 0;
const common_1 = require("@nestjs/common");
const environment_config_service_1 = require("../config/environment-config.service");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let FileLoaderService = FileLoaderService_1 = class FileLoaderService {
    constructor(environmentConfig) {
        this.environmentConfig = environmentConfig;
        this.logger = new common_1.Logger(FileLoaderService_1.name);
        this.cache = new Map();
    }
    async load(filePath) {
        if (this.environmentConfig.env !== "development" &&
            this.cache.has(filePath)) {
            return this.cache.get(filePath);
        }
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        try {
            const content = await this.loadFileByExt(filePath);
            this.cache.set(filePath, content);
            return content;
        }
        catch (error) {
            this.logger.error(`Failed to load file: ${filePath} - ${error.message}`);
            throw error;
        }
    }
    async loadFileByExt(filePath) {
        const ext = path_1.default.extname(filePath);
        switch (ext) {
            case ".ts":
            case ".js":
                const imported = await Promise.resolve(`${path_1.default.resolve(filePath)}`).then(s => __importStar(require(s)));
                return (imported.default || imported);
            case ".sql":
            default:
                return (await fs_1.default.promises.readFile(filePath, "utf8"));
        }
    }
};
exports.FileLoaderService = FileLoaderService;
exports.FileLoaderService = FileLoaderService = FileLoaderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [environment_config_service_1.EnvironmentConfigService])
], FileLoaderService);
//# sourceMappingURL=file-loader.service.js.map