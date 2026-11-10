"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var DatasourceConfigRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasourceConfigRepository = void 0;
const common_1 = require("@nestjs/common");
const path_1 = __importDefault(require("path"));
const file_loader_service_1 = require("../../common/services/file-loader.service");
let DatasourceConfigRepository = DatasourceConfigRepository_1 = class DatasourceConfigRepository {
    constructor(fileLoaderService) {
        this.fileLoaderService = fileLoaderService;
        this.logger = new common_1.Logger(DatasourceConfigRepository_1.name);
        this.cache = new Map();
    }
    async getByName(datasourceName) {
        return this.fileLoaderService.load(this.getConfigPath(datasourceName));
    }
    getConfigPath(datasourceName) {
        const formattedPath = datasourceName.replaceAll("_", "/");
        return path_1.default.join(process.cwd(), "dist", "src", "domain", "config", "datasources", `${formattedPath}.datasource.js`);
    }
};
exports.DatasourceConfigRepository = DatasourceConfigRepository;
exports.DatasourceConfigRepository = DatasourceConfigRepository = DatasourceConfigRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_loader_service_1.FileLoaderService])
], DatasourceConfigRepository);
//# sourceMappingURL=datasource-config.repository.js.map