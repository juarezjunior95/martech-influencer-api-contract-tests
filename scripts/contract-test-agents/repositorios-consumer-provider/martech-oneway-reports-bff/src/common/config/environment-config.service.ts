import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Environment Configuration Service
 * Provides typed access to environment variables
 */
@Injectable()
export class EnvironmentConfigService {
  constructor(private readonly configService: ConfigService) {}

  get dataService() {
    return {
      baseUrl: this.configService.get<string>("DATA_SERVICE_BASE_URL"),
    };
  }

  get redis() {
    return {
      host: this.configService.get<string>("REDIS_HOST"),
      port: this.configService.get<number>("REDIS_PORT"),
      password: this.configService.get<string>("REDIS_PASSWORD"),
    };
  }

  get viewCache() {
    return {
      enabled:
        this.configService.get<string>("VIEW_CACHE_ENABLED", "false") ===
        "true",
    };
  }

  get presetCache() {
    return {
      enabled:
        this.configService.get<string>("PRESET_CACHE_ENABLED", "false") ===
        "true",
    };
  }

  get env() {
    return this.configService.get<string>("NODE_ENV");
  }
}
