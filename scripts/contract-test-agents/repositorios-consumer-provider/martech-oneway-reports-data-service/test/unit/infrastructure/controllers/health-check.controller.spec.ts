import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "@infrastructure/controllers/health-check.controller";
import { HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";

describe("HealthController", () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;
  let httpHealthIndicator: jest.Mocked<HttpHealthIndicator>;

  beforeEach(async () => {
    const mockHealthCheckService = {
      check: jest.fn(),
    } as unknown as jest.Mocked<HealthCheckService>;

    const mockHttpHealthIndicator = {
      pingCheck: jest.fn(),
    } as unknown as jest.Mocked<HttpHealthIndicator>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: HttpHealthIndicator,
          useValue: mockHttpHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get(HealthCheckService);
    httpHealthIndicator = module.get(HttpHealthIndicator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("checkLiveness", () => {
    it("should return health check status for liveness", async () => {
      const expectedResult = {
        status: "ok" as const,
        info: {},
        error: {},
        details: {},
      };

      healthCheckService.check.mockResolvedValue(expectedResult);

      const result = await controller.checkLiveness();

      expect(result).toEqual(expectedResult);
      expect(healthCheckService.check).toHaveBeenCalledWith([]);
      expect(healthCheckService.check).toHaveBeenCalledTimes(1);
    });

    it("should call health check service with empty array", async () => {
      const expectedResult = {
        status: "ok" as const,
        info: {},
        error: {},
        details: {},
      };

      healthCheckService.check.mockResolvedValue(expectedResult);

      await controller.checkLiveness();

      expect(healthCheckService.check).toHaveBeenCalledWith([]);
    });

    it("should handle health check service errors", async () => {
      const error = new Error("Health check failed");
      healthCheckService.check.mockRejectedValue(error);

      await expect(controller.checkLiveness()).rejects.toThrow(
        "Health check failed",
      );
    });

    it("should return ok status when application is alive", async () => {
      const expectedResult = {
        status: "ok" as const,
        info: {},
        error: {},
        details: {},
      };

      healthCheckService.check.mockResolvedValue(expectedResult);

      const result = await controller.checkLiveness();

      expect(result.status).toBe("ok");
    });
  });

  describe("checkReadiness", () => {
    it("should return health check status for readiness", async () => {
      const expectedResult = {
        status: "ok" as const,
        info: {
          readiness: {
            status: "up" as const,
          },
        },
        error: {},
        details: {
          readiness: {
            status: "up" as const,
          },
        },
      };

      healthCheckService.check.mockResolvedValue(expectedResult);

      const result = await controller.checkReadiness();

      expect(result).toEqual(expectedResult);
      expect(healthCheckService.check).toHaveBeenCalledTimes(1);
    });

    it("should call health check service with readiness indicator", async () => {
      const expectedResult = {
        status: "ok" as const,
        info: {
          readiness: {
            status: "up" as const,
          },
        },
        error: {},
        details: {
          readiness: {
            status: "up" as const,
          },
        },
      };

      healthCheckService.check.mockResolvedValue(expectedResult);

      await controller.checkReadiness();

      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
    });

    it("should execute readiness check function", async () => {
      let capturedFunction: (() => Promise<unknown>) | null = null;

      healthCheckService.check.mockImplementation(async (checks) => {
        if (checks.length > 0 && typeof checks[0] === "function") {
          capturedFunction = checks[0] as () => Promise<unknown>;
        }
        return {
          status: "ok" as const,
          info: {},
          error: {},
          details: {},
        };
      });

      await controller.checkReadiness();

      expect(capturedFunction).not.toBeNull();

      if (capturedFunction) {
        const result = await capturedFunction();
        expect(result).toEqual({
          readiness: {
            status: "up",
          },
        });
      }
    });

    it("should handle health check service errors", async () => {
      const error = new Error("Readiness check failed");
      healthCheckService.check.mockRejectedValue(error);

      await expect(controller.checkReadiness()).rejects.toThrow(
        "Readiness check failed",
      );
    });

    it("should return ok status when application is ready", async () => {
      const expectedResult = {
        status: "ok" as const,
        info: {
          readiness: {
            status: "up" as const,
          },
        },
        error: {},
        details: {
          readiness: {
            status: "up" as const,
          },
        },
      };

      healthCheckService.check.mockResolvedValue(expectedResult);

      const result = await controller.checkReadiness();

      expect(result.status).toBe("ok");
    });

    it("should include readiness details in response", async () => {
      const expectedResult = {
        status: "ok" as const,
        info: {
          readiness: {
            status: "up" as const,
          },
        },
        error: {},
        details: {
          readiness: {
            status: "up" as const,
          },
        },
      };

      healthCheckService.check.mockResolvedValue(expectedResult);

      const result = await controller.checkReadiness();

      expect(result.details).toHaveProperty("readiness");
    });
  });

  describe("controller metadata", () => {
    it("should be defined", () => {
      expect(controller).toBeDefined();
    });

    it("should have checkLiveness method", () => {
      expect(controller.checkLiveness).toBeDefined();
      expect(typeof controller.checkLiveness).toBe("function");
    });

    it("should have checkReadiness method", () => {
      expect(controller.checkReadiness).toBeDefined();
      expect(typeof controller.checkReadiness).toBe("function");
    });
  });

  describe("dependency injection", () => {
    it("should inject HealthCheckService", () => {
      expect(healthCheckService).toBeDefined();
    });

    it("should inject HttpHealthIndicator", () => {
      expect(httpHealthIndicator).toBeDefined();
    });
  });
});
