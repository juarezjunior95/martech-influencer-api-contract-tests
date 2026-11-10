"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageCacheModule = void 0;
const common_1 = require("@nestjs/common");
const common_module_1 = require("../../common/common.module");
const redis_module_1 = require("./redis.module");
const page_cache_controller_1 = require("../controllers/page-cache.controller");
const page_cache_repository_1 = require("../repositories/page-cache.repository");
const page_cache_config_repository_1 = require("../repositories/page-cache-config.repository");
const get_page_cache_usecase_1 = require("../../application/usecases/get-page-cache.usecase");
const set_page_cache_usecase_1 = require("../../application/usecases/set-page-cache.usecase");
let PageCacheModule = class PageCacheModule {
};
exports.PageCacheModule = PageCacheModule;
exports.PageCacheModule = PageCacheModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule, redis_module_1.RedisModule],
        controllers: [page_cache_controller_1.PageCacheController],
        providers: [
            {
                provide: "IPageCacheRepository",
                useClass: page_cache_repository_1.PageCacheRepository,
            },
            {
                provide: "IPageCacheConfigRepository",
                useClass: page_cache_config_repository_1.PageCacheConfigRepository,
            },
            get_page_cache_usecase_1.GetPageCacheUseCase,
            set_page_cache_usecase_1.SetPageCacheUseCase,
        ],
        exports: ["IPageCacheRepository"],
    })
], PageCacheModule);
//# sourceMappingURL=page-cache.module.js.map