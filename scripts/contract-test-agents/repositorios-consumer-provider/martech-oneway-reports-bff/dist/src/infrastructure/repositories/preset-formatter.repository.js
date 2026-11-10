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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PresetFormatterRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetFormatterRepository = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path = __importStar(require("path"));
const jsonata_1 = __importDefault(require("jsonata"));
const environment_config_service_1 = require("../../common/config/environment-config.service");
const helpers_1 = require("./helpers");
let PresetFormatterRepository = PresetFormatterRepository_1 = class PresetFormatterRepository {
    constructor(environmentConfig) {
        this.environmentConfig = environmentConfig;
        this.logger = new common_1.Logger(PresetFormatterRepository_1.name);
        this.cache = new Map();
        this.formattersPath = path.join(process.cwd(), "src", "infrastructure", "formatters");
    }
    async format(formatter, data) {
        try {
            const expression = await this.loadExpression(formatter);
            const result = await expression.evaluate(data);
            return (result ?? data);
        }
        catch (error) {
            this.logger.error(`Error formatting preset with '${formatter}': ${error.message}`);
            throw error;
        }
    }
    async loadExpression(formatter) {
        if (this.cache.has(formatter) &&
            this.environmentConfig.env !== "development") {
            return this.cache.get(formatter);
        }
        const formatterPath = path.join(this.formattersPath, `${formatter}.jsonata`);
        try {
            await (0, promises_1.access)(formatterPath);
        }
        catch {
            throw new Error(`Formatter file not found: ${formatterPath}`);
        }
        const content = await (0, promises_1.readFile)(formatterPath, "utf8");
        const compiled = (0, jsonata_1.default)(content);
        (0, helpers_1.registerHelpers)(compiled);
        this.cache.set(formatter, compiled);
        return compiled;
    }
};
exports.PresetFormatterRepository = PresetFormatterRepository;
exports.PresetFormatterRepository = PresetFormatterRepository = PresetFormatterRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IEnvironmentConfigService")),
    __metadata("design:paramtypes", [environment_config_service_1.EnvironmentConfigService])
], PresetFormatterRepository);
//# sourceMappingURL=preset-formatter.repository.js.map