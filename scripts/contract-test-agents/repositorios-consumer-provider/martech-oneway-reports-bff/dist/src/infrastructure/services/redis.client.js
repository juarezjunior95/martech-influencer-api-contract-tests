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
var RedisClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisClient = RedisClient_1 = class RedisClient {
    constructor(client) {
        this.client = client;
        this.logger = new common_1.Logger(RedisClient_1.name);
        this.DEFAULT_TTL = 2592000;
    }
    isOffline() {
        const status = this.client.status;
        return status !== "ready" && status !== "connect";
    }
    async set(key, value, ttl = this.DEFAULT_TTL, tags = []) {
        try {
            const result = await this.client.set(key, value, "EX", ttl);
            if (tags.length > 0) {
                await this.linkTagsToCache(tags, key);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to set key "${key}": ${error.message}`);
            throw error;
        }
    }
    async linkTagsToCache(tags, cacheKey) {
        try {
            for (const tag of tags) {
                await this.client.sadd(tag, cacheKey);
            }
        }
        catch (error) {
            this.logger.error(`Failed to link tags to cache key "${cacheKey}": ${error.message}`);
            throw error;
        }
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (error) {
            this.logger.error(`Failed to get key "${key}": ${error.message}`);
            throw error;
        }
    }
    async ttl(key) {
        try {
            const ttl = await this.client.ttl(key);
            if (ttl < 0) {
                return null;
            }
            return ttl;
        }
        catch (error) {
            this.logger.error(`Failed to read TTL for key "${key}": ${error.message}`);
            throw error;
        }
    }
    async acquireLock(key, ttlSeconds) {
        try {
            const result = await this.client.set(key, "1", "EX", ttlSeconds, "NX");
            return result === "OK";
        }
        catch (error) {
            this.logger.error(`Failed to acquire lock "${key}": ${error.message}`);
            throw error;
        }
    }
    async releaseLock(key) {
        try {
            const deleted = await this.client.del(key);
            return deleted > 0;
        }
        catch (error) {
            this.logger.error(`Failed to release lock "${key}": ${error.message}`);
            throw error;
        }
    }
    async delete(key) {
        try {
            return await this.client.del(key);
        }
        catch (error) {
            this.logger.error(`Failed to delete key "${key}": ${error.message}`);
            throw error;
        }
    }
    async invalidateByTags(tags) {
        let totalDeleted = 0;
        try {
            for (const tag of tags) {
                const cacheKeys = await this.client.smembers(tag);
                if (cacheKeys.length === 0) {
                    continue;
                }
                for (const key of cacheKeys) {
                    await this.client.del(key);
                    totalDeleted++;
                }
                await this.client.del(tag);
            }
            return totalDeleted;
        }
        catch (error) {
            this.logger.error(`Failed to invalidate by tags [${tags.join(", ")}]: ${error.message}`);
            throw error;
        }
    }
};
exports.RedisClient = RedisClient;
exports.RedisClient = RedisClient = RedisClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("REDIS_CLIENT")),
    __metadata("design:paramtypes", [ioredis_1.Redis])
], RedisClient);
//# sourceMappingURL=redis.client.js.map