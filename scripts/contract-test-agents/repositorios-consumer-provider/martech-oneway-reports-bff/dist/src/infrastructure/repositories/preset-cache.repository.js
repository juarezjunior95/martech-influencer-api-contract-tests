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
var PresetCacheRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetCacheRepository = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const redis_client_1 = require("../services/redis.client");
let PresetCacheRepository = PresetCacheRepository_1 = class PresetCacheRepository {
    constructor(redisClient) {
        this.redisClient = redisClient;
        this.logger = new common_1.Logger(PresetCacheRepository_1.name);
        this.CACHE_PREFIX = "preset:";
        this.DEFAULT_TTL = 2592000;
        this.USER_COUNTRY_SCOPE = "OneWayReports.CountryViewer.Read";
    }
    async getPreset(preset, user) {
        if (this.redisClient.isOffline()) {
            this.logger.warn("Redis is offline, skipping preset cache read");
            return null;
        }
        try {
            const cacheKey = this.buildCacheKey(preset, user);
            const cached = await this.redisClient.get(cacheKey);
            if (!cached) {
                return null;
            }
            const parsed = JSON.parse(cached);
            if (!parsed ||
                typeof parsed.name !== "string" ||
                typeof parsed.data !== "object" ||
                parsed.data === null) {
                this.logger.warn(`Discarding malformed preset cache for "${preset.getName()}"`);
                return null;
            }
            return parsed;
        }
        catch (error) {
            this.logger.error(`Error reading preset cache for "${preset.getName()}": ${error.message}`);
            return null;
        }
    }
    async setPreset(preset, user, result, ttl = this.DEFAULT_TTL) {
        if (this.redisClient.isOffline()) {
            this.logger.warn("Redis is offline, skipping preset cache write");
            return false;
        }
        try {
            const cacheKey = this.buildCacheKey(preset, user);
            const tags = this.buildCacheTags(preset);
            await this.redisClient.set(cacheKey, JSON.stringify(result), ttl, tags);
            return true;
        }
        catch (error) {
            this.logger.error(`Error writing preset cache for "${preset.getName()}": ${error.message}`);
            return false;
        }
    }
    buildCacheKey(preset, user) {
        const parts = [`${this.CACHE_PREFIX}${preset.getName()}`];
        const filters = preset.getSortedFilters();
        if (filters.length) {
            parts.push(`filters:${this.hash(JSON.stringify(filters))}`);
        }
        const userScope = this.buildUserScopeKey(user);
        if (userScope) {
            parts.push(`user:${userScope}`);
        }
        return parts.join(":");
    }
    buildUserScopeKey(user) {
        if (!user)
            return null;
        const scopes = user.getScopes(true);
        const country = user.country ?? "";
        if (!scopes.length && !country)
            return null;
        let countryKey = country;
        if (scopes.includes(this.USER_COUNTRY_SCOPE)) {
            const supportedCountries = user.supportedCountries ?? [];
            countryKey = [...new Set([country, ...supportedCountries])].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
        }
        return this.hash(JSON.stringify({ countryKey, scopes }));
    }
    buildCacheTags(preset) {
        const tags = preset.getCacheConfig().tags ?? [];
        return tags.map((tag) => `${this.CACHE_PREFIX}${tag}`);
    }
    async invalidateByTags(tags) {
        try {
            if (!tags || tags.length === 0) {
                this.logger.warn("No tags provided for preset cache invalidation");
                return 0;
            }
            const prefixedTags = tags.map((tag) => `${this.CACHE_PREFIX}${tag}`);
            const deletedCount = await this.redisClient.invalidateByTags(prefixedTags);
            return deletedCount;
        }
        catch (error) {
            this.logger.error(`Error invalidating preset cache for tags [${tags.join(", ")}]: ${error.message}`);
            throw error;
        }
    }
    hash(value) {
        return (0, crypto_1.createHash)("sha256").update(value).digest("hex");
    }
};
exports.PresetCacheRepository = PresetCacheRepository;
exports.PresetCacheRepository = PresetCacheRepository = PresetCacheRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("RedisClient")),
    __metadata("design:paramtypes", [redis_client_1.RedisClient])
], PresetCacheRepository);
//# sourceMappingURL=preset-cache.repository.js.map