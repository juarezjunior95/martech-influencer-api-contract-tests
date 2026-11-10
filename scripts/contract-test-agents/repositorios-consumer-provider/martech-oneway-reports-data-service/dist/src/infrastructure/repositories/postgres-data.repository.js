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
var PostgresDataRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDataRepository = void 0;
const common_1 = require("@nestjs/common");
const postgres_client_1 = require("../services/postgres.client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const file_loader_service_1 = require("../../common/services/file-loader.service");
let PostgresDataRepository = PostgresDataRepository_1 = class PostgresDataRepository {
    constructor(postgresClient, fileLoaderService) {
        this.postgresClient = postgresClient;
        this.fileLoaderService = fileLoaderService;
        this.logger = new common_1.Logger(PostgresDataRepository_1.name);
        this.cache = new Map();
        this.sqlDirectory = path.join(process.cwd(), "src", "infrastructure", "sql", "postgres");
    }
    async fetchData(fetchDataConfig, filters) {
        try {
            const sqlFilePath = path.join(this.sqlDirectory, `${fetchDataConfig.query}.sql`);
            const sqlQuery = await this.fileLoaderService.load(sqlFilePath);
            const { query: convertedQuery, parameters } = this.convertFiltersToNamedParameters(sqlQuery, filters);
            const result = await this.postgresClient.executeQuery(convertedQuery, parameters);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to fetch data: ${error.message}`);
            throw error;
        }
    }
    convertFiltersToNamedParameters(sqlQuery, filters) {
        const filterMap = new Map();
        filters?.forEach((filter) => {
            filterMap.set(filter.name, filter.value);
        });
        const paramNames = [];
        const regex = /\$([a-zA-Z_]\w*)/g;
        let match;
        while ((match = regex.exec(sqlQuery)) !== null) {
            const paramName = match[1];
            if (paramNames.includes(paramName)) {
                continue;
            }
            if (!filterMap.has(paramName)) {
                throw new Error(`Named parameter $${paramName} found in query but not in filters list`);
            }
            paramNames.push(paramName);
        }
        const parameters = [];
        let convertedQuery = sqlQuery;
        paramNames.forEach((paramName, index) => {
            const position = index + 1;
            parameters.push(filterMap.get(paramName));
            const regex = new RegExp(`\\$${paramName}\\b`, "g");
            convertedQuery = convertedQuery.replace(regex, `$${position}`);
        });
        return { query: convertedQuery, parameters };
    }
    async loadSqlFile(sqlFile) {
        if (this.cache.has(sqlFile)) {
            return this.cache.get(sqlFile);
        }
        const sqlFilePath = path.join(this.sqlDirectory, `${sqlFile}.sql`);
        if (!fs.existsSync(sqlFilePath)) {
            throw new Error(`SQL file not found: ${sqlFile}.sql`);
        }
        const sqlContent = fs.readFileSync(sqlFilePath, "utf8");
        this.cache.set(sqlFile, sqlContent);
        return sqlContent;
    }
};
exports.PostgresDataRepository = PostgresDataRepository;
exports.PostgresDataRepository = PostgresDataRepository = PostgresDataRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("PostgresClient")),
    __metadata("design:paramtypes", [postgres_client_1.PostgresClient,
        file_loader_service_1.FileLoaderService])
], PostgresDataRepository);
//# sourceMappingURL=postgres-data.repository.js.map