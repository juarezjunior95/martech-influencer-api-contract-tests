import { Module, OnApplicationShutdown } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { RedisClient } from "../services/redis.client";
import { Redis } from "ioredis";
import { CommonModule } from "@common/common.module";
import { EnvironmentConfigService } from "@common/config/environment-config.service";

/**
 * Redis Module
 * Handles Redis cache connections and operations
 */
@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: async (
        environmentConfigService: EnvironmentConfigService,
      ) => {
        const logger = new Logger(RedisModule.name);
        const config = environmentConfigService.redis;
        let lastErrorTime = 0;
        const errorLogThrottle = 5 * 60 * 1000; // Log error at most once every 5 minutes

        const redis = new Redis({
          host: config.host,
          port: config.port,
          password: config.password,
          retryStrategy: (times) => {
            // Reconnects in background with linear delay (exponential capped)
            // Delay increases: 50ms, 100ms, 150ms... up to 2000ms (2 seconds max)
            // Example: 1st try = 50ms, 2nd = 100ms, 40th+ = 2000ms
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
      useClass: RedisClient,
    },
  ],
  exports: ["RedisClient"],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(): any {
    const client = this.moduleRef.get("REDIS_CLIENT") as Redis;
    return client.quit();
  }
}
