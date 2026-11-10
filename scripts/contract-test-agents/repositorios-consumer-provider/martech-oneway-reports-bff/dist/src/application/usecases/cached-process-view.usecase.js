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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CachedProcessViewUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedProcessViewUseCase = void 0;
const common_1 = require("@nestjs/common");
const newrelic_1 = __importDefault(require("newrelic"));
const environment_config_service_1 = require("../../common/config/environment-config.service");
let CachedProcessViewUseCase = CachedProcessViewUseCase_1 = class CachedProcessViewUseCase {
    constructor(processViewUseCase, viewCacheRepository, userRepository, environmentConfig) {
        this.processViewUseCase = processViewUseCase;
        this.viewCacheRepository = viewCacheRepository;
        this.userRepository = userRepository;
        this.environmentConfig = environmentConfig;
        this.logger = new common_1.Logger(CachedProcessViewUseCase_1.name);
    }
    async execute(view, filterSets) {
        const viewEntity = await this.processViewUseCase.createViewEntity(view, filterSets);
        const cacheConfig = viewEntity.getCacheConfig();
        if (!this.environmentConfig.viewCache.enabled || !cacheConfig.enabled) {
            newrelic_1.default.addCustomAttribute("view.cache.hit", false);
            return this.processViewUseCase.processViewEntity(viewEntity);
        }
        const user = await this.userRepository.getCurrentUser();
        const cachedResult = await this.viewCacheRepository.getView(viewEntity, user);
        if (cachedResult) {
            newrelic_1.default.addCustomAttribute("view.cache.hit", true);
            this.logger.log(`Cache hit for view '${view}'`);
            return cachedResult;
        }
        newrelic_1.default.addCustomAttribute("view.cache.hit", false);
        const result = await this.processViewUseCase.processViewEntity(viewEntity);
        if (this.hasComponentErrors(result)) {
            this.logger.warn(`Not caching view '${view}' due to component errors`);
            return result;
        }
        const cacheSaved = await this.viewCacheRepository.setView(viewEntity, user, result);
        this.logger.log(`View '${view}' processed${cacheSaved ? " and cached" : " (cache not saved)"}`);
        return result;
    }
    hasComponentErrors(result) {
        if (!result || !result.components || !Array.isArray(result.components)) {
            return false;
        }
        return result.components.some((component) => component && component.error);
    }
    async createViewEntity(view, filterSets) {
        return this.processViewUseCase.createViewEntity(view, filterSets);
    }
    async processViewEntity(viewEntity) {
        return this.processViewUseCase.processViewEntity(viewEntity);
    }
};
exports.CachedProcessViewUseCase = CachedProcessViewUseCase;
exports.CachedProcessViewUseCase = CachedProcessViewUseCase = CachedProcessViewUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IProcessViewUseCase")),
    __param(1, (0, common_1.Inject)("IViewCacheRepository")),
    __param(2, (0, common_1.Inject)("IUserRepository")),
    __param(3, (0, common_1.Inject)("IEnvironmentConfigService")),
    __metadata("design:paramtypes", [Object, Object, Object, environment_config_service_1.EnvironmentConfigService])
], CachedProcessViewUseCase);
//# sourceMappingURL=cached-process-view.usecase.js.map