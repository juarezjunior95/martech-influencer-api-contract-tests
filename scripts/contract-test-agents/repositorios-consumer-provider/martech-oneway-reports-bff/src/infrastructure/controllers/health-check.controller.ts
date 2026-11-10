import { Controller, Get, Inject } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from "@nestjs/terminus";
import { EnvironmentConfigService } from "@common/config/environment-config.service";

@Controller("actuator/health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    @Inject("IEnvironmentConfigService")
    private environmentConfigService: EnvironmentConfigService,
  ) {}

  // Liveness: only checks if the application is alive
  @Get("/liveness")
  @HealthCheck()
  checkLiveness() {
    return this.health.check([]);
  }

  // Readiness: checks if the application is ready to receive traffic
  @Get("/readiness")
  @HealthCheck()
  checkReadiness() {
    const dataServiceUrl = this.environmentConfigService.dataService.baseUrl;

    return this.health.check([
      // Check if data service is accessible using pingCheck
      () =>
        this.http.pingCheck(
          "data-service",
          `${dataServiceUrl}/actuator/health/liveness`,
        ),
    ]);
  }
}
