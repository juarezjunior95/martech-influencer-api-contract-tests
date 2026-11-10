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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const redis_client_1 = require("../services/redis.client");
const ioredis_1 = require("ioredis");
const common_module_1 = require("../../common/common.module");
let RedisModule = class RedisModule {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    onApplicationShutdown() {
        const client = this.moduleRef.get("REDIS_CLIENT");
        return client.quit();
    }
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule],
        providers: [
            {
                provide: "REDIS_CLIENT",
                useFactory: async (environmentConfigService) => {
                    const logger = new common_2.Logger(RedisModule.name);
                    const config = environmentConfigService.redis;
                    let lastErrorTime = 0;
                    const errorLogThrottle = 5 * 60 * 1000;
                    const redis = new ioredis_1.Redis({
                        host: config.host,
                        port: config.port,
                        password: config.password,
                        retryStrategy: (times) => {
                            const delay = Math.min(times * 50, 2000);
                            return delay;
                        },
                    });
                    redis.on("error", (error) => {
                        const now = Date.now();
                        if (now - lastErrorTime > errorLogThrottle) {
                            logger.warn(`Redis connection error: ${error.message}`);
                            lastErrorTime = now;
                        }
                    });
                    redis.on("ready", () => {
                        logger.log("Redis connected successfully");
                    });
                    redis.on("connect", () => {
                        logger.log("Redis connection established");
                    });
                    return redis;
                },
                inject: ["IEnvironmentConfigService"],
            },
            {
                provide: "RedisClient",
                useClass: redis_client_1.RedisClient,
            },
        ],
        exports: ["RedisClient"],
    }),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], RedisModule);
//# sourceMappingURL=redis.module.js.map