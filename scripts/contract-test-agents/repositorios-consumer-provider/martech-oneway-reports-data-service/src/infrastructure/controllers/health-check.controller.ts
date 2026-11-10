import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from "@nestjs/terminus";

@Controller("actuator/health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
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
    return this.health.check([
      // Simple verification that the application is ready
      async () => ({ readiness: { status: "up" } }),
    ]);
  }
}
