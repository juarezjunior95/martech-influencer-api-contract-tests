"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetModule = void 0;
const common_1 = require("@nestjs/common");
const common_module_1 = require("../../common/common.module");
const preset_controller_1 = require("../controllers/preset.controller");
const process_preset_usecase_1 = require("../../application/usecases/process-preset.usecase");
const cached_process_preset_usecase_1 = require("../../application/usecases/cached-process-preset.usecase");
const tokens_1 = require("../../application/usecases/tokens");
const preset_config_repository_1 = require("../repositories/preset-config.repository");
const preset_repository_1 = require("../repositories/preset.repository");
const preset_cache_repository_1 = require("../repositories/preset-cache.repository");
const preset_formatter_repository_1 = require("../repositories/preset-formatter.repository");
const user_repository_1 = require("../repositories/user.repository");
const data_service_client_1 = require("../services/data-service.client");
const redis_module_1 = require("./redis.module");
let PresetModule = class PresetModule {
};
exports.PresetModule = PresetModule;
exports.PresetModule = PresetModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule, redis_module_1.RedisModule],
        controllers: [preset_controller_1.PresetController],
        providers: [
            { provide: "IPresetConfigRepository", useClass: preset_config_repository_1.PresetConfigRepository },
            { provide: "IPresetRepository", useClass: preset_repository_1.PresetRepository },
            { provide: "IPresetCacheRepository", useClass: preset_cache_repository_1.PresetCacheRepository },
            {
                provide: "IPresetFormatterRepository",
                useClass: preset_formatter_repository_1.PresetFormatterRepository,
            },
            { provide: "IUserRepository", useClass: user_repository_1.CurrentUserRepository },
            data_service_client_1.DataServiceClient,
            { provide: tokens_1.PROCESS_PRESET_USE_CASE, useClass: process_preset_usecase_1.ProcessPresetUseCase },
            {
                provide: tokens_1.CACHED_PROCESS_PRESET_USE_CASE,
                useClass: cached_process_preset_usecase_1.CachedProcessPresetUseCase,
            },
        ],
        exports: [
            "IPresetConfigRepository",
            "IPresetRepository",
            "IPresetCacheRepository",
            "IPresetFormatterRepository",
            tokens_1.PROCESS_PRESET_USE_CASE,
            tokens_1.CACHED_PROCESS_PRESET_USE_CASE,
        ],
    })
], PresetModule);
//# sourceMappingURL=preset.module.js.map