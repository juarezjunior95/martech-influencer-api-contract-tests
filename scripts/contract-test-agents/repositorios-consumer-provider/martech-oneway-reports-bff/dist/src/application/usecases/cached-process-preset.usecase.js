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
var CachedProcessPresetUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedProcessPresetUseCase = void 0;
const common_1 = require("@nestjs/common");
const newrelic_1 = __importDefault(require("newrelic"));
const tokens_1 = require("./tokens");
const environment_config_service_1 = require("../../common/config/environment-config.service");
let CachedProcessPresetUseCase = CachedProcessPresetUseCase_1 = class CachedProcessPresetUseCase {
    constructor(processPresetUseCase, presetCacheRepository, userRepository, environmentConfig) {
        this.processPresetUseCase = processPresetUseCase;
        this.presetCacheRepository = presetCacheRepository;
        this.userRepository = userRepository;
        this.environmentConfig = environmentConfig;
        this.logger = new common_1.Logger(CachedProcessPresetUseCase_1.name);
    }
    async execute(presetName, filters) {
        const preset = await this.processPresetUseCase.createPresetEntity(presetName, filters);
        const cacheConfig = preset.getCacheConfig();
        const cacheFeatureEnabled = this.environmentConfig.presetCache?.enabled ??
            this.environmentConfig.viewCache.enabled;
        if (!cacheFeatureEnabled || !cacheConfig.enabled) {
            newrelic_1.default.addCustomAttribute("preset.cache.hit", false);
            return this.processPresetUseCase.processPresetEntity(preset);
        }
        const user = await this.userRepository.getCurrentUser();
        const cached = await this.presetCacheRepository.getPreset(preset, user);
        if (cached) {
            newrelic_1.default.addCustomAttribute("preset.cache.hit", true);
            this.logger.log(`Cache hit for preset '${presetName}'`);
            return cached;
        }
        newrelic_1.default.addCustomAttribute("preset.cache.hit", false);
        const result = await this.processPresetUseCase.processPresetEntity(preset);
        const saved = await this.presetCacheRepository.setPreset(preset, user, result);
        this.logger.log(`Preset '${presetName}' processed${saved ? " and cached" : " (cache not saved)"}`);
        return result;
    }
    async createPresetEntity(presetName, filters) {
        return this.processPresetUseCase.createPresetEntity(presetName, filters);
    }
    async processPresetEntity(preset) {
        return this.processPresetUseCase.processPresetEntity(preset);
    }
};
exports.CachedProcessPresetUseCase = CachedProcessPresetUseCase;
exports.CachedProcessPresetUseCase = CachedProcessPresetUseCase = CachedProcessPresetUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tokens_1.PROCESS_PRESET_USE_CASE)),
    __param(1, (0, common_1.Inject)("IPresetCacheRepository")),
    __param(2, (0, common_1.Inject)("IUserRepository")),
    __param(3, (0, common_1.Inject)("IEnvironmentConfigService")),
    __metadata("design:paramtypes", [Object, Object, Object, environment_config_service_1.EnvironmentConfigService])
], CachedProcessPresetUseCase);
//# sourceMappingURL=cached-process-preset.usecase.js.map