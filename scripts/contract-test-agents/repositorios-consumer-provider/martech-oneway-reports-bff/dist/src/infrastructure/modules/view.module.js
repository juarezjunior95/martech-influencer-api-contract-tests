"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewModule = void 0;
const common_1 = require("@nestjs/common");
const common_module_1 = require("../../common/common.module");
const view_controller_1 = require("../controllers/view.controller");
const process_view_usecase_1 = require("../../application/usecases/process-view.usecase");
const cached_process_view_usecase_1 = require("../../application/usecases/cached-process-view.usecase");
const clear_cache_usecase_1 = require("../../application/usecases/clear-cache.usecase");
const datasource_repository_1 = require("../repositories/datasource.repository");
const formatter_repository_1 = require("../repositories/formatter.repository");
const view_config_repository_1 = require("../repositories/view-config.repository");
const view_cache_repository_1 = require("../repositories/view-cache.repository");
const user_repository_1 = require("../repositories/user.repository");
const data_service_client_1 = require("../services/data-service.client");
const redis_module_1 = require("./redis.module");
const preset_cache_repository_1 = require("../repositories/preset-cache.repository");
const page_cache_module_1 = require("./page-cache.module");
let ViewModule = class ViewModule {
};
exports.ViewModule = ViewModule;
exports.ViewModule = ViewModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule, redis_module_1.RedisModule, page_cache_module_1.PageCacheModule],
        controllers: [view_controller_1.ViewController],
        providers: [
            {
                provide: "IDataRepository",
                useClass: datasource_repository_1.DataRepository,
            },
            {
                provide: "IViewConfigRepository",
                useClass: view_config_repository_1.ViewConfigRepository,
            },
            {
                provide: "IFormatterRepository",
                useClass: formatter_repository_1.FormatterRepository,
            },
            {
                provide: "IViewCacheRepository",
                useClass: view_cache_repository_1.ViewCacheRepository,
            },
            {
                provide: "IPresetCacheRepository",
                useClass: preset_cache_repository_1.PresetCacheRepository,
            },
            {
                provide: "IUserRepository",
                useClass: user_repository_1.CurrentUserRepository,
            },
            data_service_client_1.DataServiceClient,
            {
                provide: "IProcessViewUseCase",
                useClass: process_view_usecase_1.ProcessViewUseCase,
            },
            {
                provide: "ICachedProcessViewUseCase",
                useClass: cached_process_view_usecase_1.CachedProcessViewUseCase,
            },
            {
                provide: "ClearCacheUseCase",
                useClass: clear_cache_usecase_1.ClearCacheUseCase,
            },
        ],
        exports: [
            "IDataRepository",
            "IViewConfigRepository",
            "IFormatterRepository",
            "IViewCacheRepository",
            "IUserRepository",
            "IProcessViewUseCase",
            "ICachedProcessViewUseCase",
        ],
    })
], ViewModule);
//# sourceMappingURL=view.module.js.map