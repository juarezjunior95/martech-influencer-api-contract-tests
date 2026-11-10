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
var FormatterRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatterRepository = void 0;
const common_1 = require("@nestjs/common");
const jsonata_1 = __importDefault(require("jsonata"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const environment_config_service_1 = require("../../common/config/environment-config.service");
const helpers_1 = require("./helpers");
let FormatterRepository = FormatterRepository_1 = class FormatterRepository {
    constructor(environmentConfig) {
        this.environmentConfig = environmentConfig;
        this.logger = new common_1.Logger(FormatterRepository_1.name);
        this.cache = new Map();
        this.formattersPath = path.join(process.cwd(), "src", "infrastructure", "formatters");
    }
    async format(formatter, data, context) {
        try {
            const expression = await this.loadJsonataExpression(formatter);
            const datasources = this.createDatasourcesObject(data, context?.filters);
            const result = await expression.evaluate(datasources);
            return result;
        }
        catch (error) {
            this.logger.error(`Error formatting data with formatter '${formatter}': ${error.message}`);
            throw error;
        }
    }
    async loadJsonataExpression(formatter) {
        if (this.cache.has(formatter) &&
            this.environmentConfig.env !== "development") {
            return this.cache.get(formatter);
        }
        const formatterPath = path.join(this.formattersPath, `${formatter}.jsonata`);
        if (!fs.existsSync(formatterPath)) {
            throw new Error(`Formatter file not found: ${formatterPath}`);
        }
        const expressionContent = fs.readFileSync(formatterPath, "utf8");
        const compiledExpression = (0, jsonata_1.default)(expressionContent);
        (0, helpers_1.registerHelpers)(compiledExpression);
        this.cache.set(formatter, compiledExpression);
        return compiledExpression;
    }
    createDatasourcesObject(data, filters) {
        const datasources = {};
        data.forEach((dataSource) => {
            datasources[dataSource.title ?? dataSource.name] = dataSource.data;
        });
        return { datasources, filters: this.createFiltersObject(filters) };
    }
    createFiltersObject(filters) {
        return (filters || []).reduce((accumulator, filter) => {
            accumulator[filter.name] = filter.value;
            return accumulator;
        }, {});
    }
};
exports.FormatterRepository = FormatterRepository;
exports.FormatterRepository = FormatterRepository = FormatterRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IEnvironmentConfigService")),
    __metadata("design:paramtypes", [environment_config_service_1.EnvironmentConfigService])
], FormatterRepository);
//# sourceMappingURL=formatter.repository.js.map