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
var PageCacheRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageCacheRepository = void 0;
const common_1 = require("@nestjs/common");
const redis_client_1 = require("../services/redis.client");
let PageCacheRepository = PageCacheRepository_1 = class PageCacheRepository {
    constructor(redisClient) {
        this.redisClient = redisClient;
        this.logger = new common_1.Logger(PageCacheRepository_1.name);
        this.CACHE_PREFIX = "page-cache:";
        this.LOCK_PREFIX = "page-cache-lock:";
    }
    async get(name, hash) {
        if (this.redisClient.isOffline()) {
            this.logger.warn("Redis is offline, returning null");
            return null;
        }
        try {
            const cacheKey = this.buildCacheKey(name, hash);
            return await this.redisClient.get(cacheKey);
        }
        catch (error) {
            this.logger.error(`Error retrieving page cache for "${name}:${hash}": ${error.message}`);
            return null;
        }
    }
    async getStoredEntry(name, hash) {
        if (this.redisClient.isOffline()) {
            this.logger.warn("Redis is offline, returning null");
            return null;
        }
        try {
            const cacheKey = this.buildCacheKey(name, hash);
            const [html, ttlRemainingSeconds] = await Promise.all([
                this.redisClient.get(cacheKey),
                this.redisClient.ttl(cacheKey),
            ]);
            if (!html) {
                return null;
            }
            return { html, ttlRemainingSeconds };
        }
        catch (error) {
            this.logger.error(`Error retrieving page cache metadata for "${name}:${hash}": ${error.message}`);
            return null;
        }
    }
    async set(name, hash, data, expirationSeconds, tags) {
        if (this.redisClient.isOffline()) {
            this.logger.warn("Redis is offline, skipping set operation");
            return false;
        }
        try {
            const cacheKey = this.buildCacheKey(name, hash);
            const prefixedTags = tags.map((tag) => `${this.CACHE_PREFIX}${tag}`);
            await this.redisClient.set(cacheKey, data, expirationSeconds, prefixedTags);
            return true;
        }
        catch (error) {
            this.logger.error(`Storage failed for "${name}:${hash}": ${error.message}`);
            return false;
        }
    }
    async invalidateByTags(tags) {
        try {
            if (!tags || tags.length === 0) {
                this.logger.warn("No tags provided for page cache invalidation");
                return 0;
            }
            const prefixedTags = tags.map((tag) => `${this.CACHE_PREFIX}${tag}`);
            return await this.redisClient.invalidateByTags(prefixedTags);
        }
        catch (error) {
            this.logger.error(`Error invalidating page cache for tags [${tags.join(", ")}]: ${error.message}`);
            throw error;
        }
    }
    async acquireRevalidationLock(name, hash, ttlSeconds) {
        if (this.redisClient.isOffline()) {
            this.logger.warn("Redis is offline, skipping lock operation");
            return false;
        }
        try {
            const lockKey = this.buildLockKey(name, hash);
            return await this.redisClient.acquireLock(lockKey, ttlSeconds);
        }
        catch (error) {
            this.logger.error(`Error acquiring lock for "${name}:${hash}": ${error.message}`);
            return false;
        }
    }
    async releaseRevalidationLock(name, hash) {
        if (this.redisClient.isOffline()) {
            this.logger.warn("Redis is offline, skipping lock release");
            return false;
        }
        try {
            const lockKey = this.buildLockKey(name, hash);
            return await this.redisClient.releaseLock(lockKey);
        }
        catch (error) {
            this.logger.error(`Error releasing lock for "${name}:${hash}": ${error.message}`);
            return false;
        }
    }
    buildCacheKey(name, hash) {
        return `${this.CACHE_PREFIX}${name}:${hash}`;
    }
    buildLockKey(name, hash) {
        return `${this.LOCK_PREFIX}${name}:${hash}`;
    }
};
exports.PageCacheRepository = PageCacheRepository;
exports.PageCacheRepository = PageCacheRepository = PageCacheRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("RedisClient")),
    __metadata("design:paramtypes", [redis_client_1.RedisClient])
], PageCacheRepository);
//# sourceMappingURL=page-cache.repository.js.map