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
var ViewCacheRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewCacheRepository = void 0;
const common_1 = require("@nestjs/common");
const redis_client_1 = require("../services/redis.client");
const crypto_1 = require("crypto");
let ViewCacheRepository = ViewCacheRepository_1 = class ViewCacheRepository {
    constructor(redisClient) {
        this.redisClient = redisClient;
        this.logger = new common_1.Logger(ViewCacheRepository_1.name);
        this.CACHE_PREFIX = "view:";
        this.DEFAULT_TTL = 2592000;
    }
    async getView(viewEntity, user) {
        if (this.redisClient.isOffline()) {
            this.logger.warn("Redis is offline, returning null");
            return null;
        }
        try {
            const cacheKey = this.buildCacheKey(viewEntity);
            const cachedData = await this.redisClient.get(cacheKey);
            if (!cachedData) {
                return null;
            }
            return JSON.parse(cachedData);
        }
        catch (error) {
            this.logger.error(`Error retrieving cache for view "${viewEntity.getView()}": ${error.message}`);
            return null;
        }
    }
    async setView(viewEntity, user, result, ttl = this.DEFAULT_TTL) {
        if (this.redisClient.isOffline()) {
            this.logger.warn("Redis is offline, skipping set operation");
            return false;
        }
        try {
            const cacheKey = this.buildCacheKey(viewEntity);
            const serializedData = JSON.stringify(result);
            const cacheTags = this.buildCacheTags(viewEntity);
            await this.redisClient.set(cacheKey, serializedData, ttl, cacheTags);
            return true;
        }
        catch (error) {
            this.logger.error(`Error storing cache for view "${viewEntity.getView()}": ${error.message}`);
            return false;
        }
    }
    buildCacheKey(viewEntity, user) {
        const view = viewEntity.getView();
        const baseKey = `${this.CACHE_PREFIX}${view}`;
        const keyParts = [];
        const filterSets = viewEntity.getFilterSets(true);
        if (filterSets.length) {
            keyParts.push(`filters:${this.createHash(JSON.stringify(filterSets))}`);
        }
        if (user) {
            const userScopes = user.getScopes(true);
            if (userScopes.length) {
                keyParts.push(`user-scopes:${this.createHash(JSON.stringify(userScopes))}`);
            }
        }
        return keyParts.length ? `${baseKey}:${keyParts.join(":")}` : baseKey;
    }
    buildCacheTags(viewEntity) {
        const cacheConfig = viewEntity.getCacheConfig();
        if (!cacheConfig.tags?.length) {
            return [];
        }
        return cacheConfig.tags.map((tag) => this.addPrefixToTag(tag));
    }
    async invalidateByTags(tags) {
        try {
            if (!tags || tags.length === 0) {
                this.logger.warn("No tags provided for cache invalidation");
                return 0;
            }
            const prefixedTags = tags.map((tag) => this.addPrefixToTag(tag));
            const deletedCount = await this.redisClient.invalidateByTags(prefixedTags);
            return deletedCount;
        }
        catch (error) {
            this.logger.error(`Error invalidating cache for tags [${tags.join(", ")}]: ${error.message}`);
            throw error;
        }
    }
    addPrefixToTag(tag) {
        return `${this.CACHE_PREFIX}${tag}`;
    }
    createHash(data) {
        return (0, crypto_1.createHash)("sha256").update(data).digest("hex");
    }
};
exports.ViewCacheRepository = ViewCacheRepository;
exports.ViewCacheRepository = ViewCacheRepository = ViewCacheRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("RedisClient")),
    __metadata("design:paramtypes", [redis_client_1.RedisClient])
], ViewCacheRepository);
//# sourceMappingURL=view-cache.repository.js.map