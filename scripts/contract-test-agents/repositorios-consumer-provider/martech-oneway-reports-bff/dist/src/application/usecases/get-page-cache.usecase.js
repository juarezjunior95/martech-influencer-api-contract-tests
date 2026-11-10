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
var GetPageCacheUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPageCacheUseCase = void 0;
const common_1 = require("@nestjs/common");
const environment_config_service_1 = require("../../common/config/environment-config.service");
let GetPageCacheUseCase = GetPageCacheUseCase_1 = class GetPageCacheUseCase {
    constructor(pageCacheRepository, pageCacheConfigRepository, environmentConfig) {
        this.pageCacheRepository = pageCacheRepository;
        this.pageCacheConfigRepository = pageCacheConfigRepository;
        this.environmentConfig = environmentConfig;
        this.logger = new common_1.Logger(GetPageCacheUseCase_1.name);
        this.REVALIDATION_LOCK_SECONDS = 120;
    }
    async execute(name, hash) {
        if (!this.environmentConfig.pageCache.enabled) {
            this.logger.log("Page cache is disabled");
            return null;
        }
        const config = await this.pageCacheConfigRepository.getByName(name);
        if (!config || !config.cache.enabled) {
            this.logger.warn(`Page cache config not found or disabled for: ${name}`);
            return null;
        }
        const staleWindowSeconds = config.cache.staleWindowSeconds;
        const freshWindowSeconds = config.cache.freshWindowSeconds;
        const normalizedFreshWindowSeconds = Math.max(1, freshWindowSeconds);
        const normalizedStaleWindowSeconds = Math.max(normalizedFreshWindowSeconds, staleWindowSeconds);
        const cachedEntry = await this.pageCacheRepository.getStoredEntry(name, hash);
        if (!cachedEntry) {
            this.logger.log(`Cache miss for page "${name}" with hash "${hash}"`);
            return null;
        }
        const ttlRemainingSeconds = cachedEntry.ttlRemainingSeconds;
        const ageSeconds = ttlRemainingSeconds === null
            ? 0
            : Math.max(0, normalizedStaleWindowSeconds - ttlRemainingSeconds);
        const isStale = ageSeconds >= normalizedFreshWindowSeconds;
        let shouldRevalidate = false;
        if (isStale) {
            shouldRevalidate = await this.pageCacheRepository.acquireRevalidationLock(name, hash, this.REVALIDATION_LOCK_SECONDS);
        }
        this.logger.log(`Cache ${isStale ? "stale" : "fresh"} hit for page "${name}" with hash "${hash}"`);
        return {
            html: cachedEntry.html,
            isStale,
            cacheStatus: isStale ? "stale" : "fresh",
            shouldRevalidate,
            ttlRemainingSeconds,
            freshWindowSeconds: normalizedFreshWindowSeconds,
            staleWindowSeconds: normalizedStaleWindowSeconds,
        };
    }
};
exports.GetPageCacheUseCase = GetPageCacheUseCase;
exports.GetPageCacheUseCase = GetPageCacheUseCase = GetPageCacheUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IPageCacheRepository")),
    __param(1, (0, common_1.Inject)("IPageCacheConfigRepository")),
    __param(2, (0, common_1.Inject)("IEnvironmentConfigService")),
    __metadata("design:paramtypes", [Object, Object, environment_config_service_1.EnvironmentConfigService])
], GetPageCacheUseCase);
//# sourceMappingURL=get-page-cache.usecase.js.map