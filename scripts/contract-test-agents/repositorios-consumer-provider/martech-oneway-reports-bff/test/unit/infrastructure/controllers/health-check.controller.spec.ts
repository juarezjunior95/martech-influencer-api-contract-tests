import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "@infrastructure/controllers/health-check.controller";
import { HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";

describe("HealthController", () => {
  let controller: HealthController;
  let module: TestingModule;

  const mockHealth = { check: jest.fn() } as any;
  const mockHttp = { pingCheck: jest.fn() } as any;
  const mockEnv = { dataService: { baseUrl: "http://datasvc" } } as any;

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        HealthController,
        { provide: HealthCheckService, useValue: mockHealth },
        { provide: HttpHealthIndicator, useValue: mockHttp },
        { provide: "IEnvironmentConfigService", useValue: mockEnv },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("checkLiveness should call health.check with empty array and return its value", () => {
    const expected = { status: "ok" };
    mockHealth.check.mockReturnValue(expected);

    const result = controller.checkLiveness();

    expect(mockHealth.check).toHaveBeenCalledWith([]);
    expect(result).toBe(expected);
  });

  it("checkReadiness should build URL and call http.pingCheck via health.check", async () => {
    // health.check receives an array of functions; capture and run them to ensure pingCheck is invoked
    mockHealth.check.mockImplementation((fns: (() => Promise<any>)[]) => {
      expect(Array.isArray(fns)).toBe(true);
      expect(fns.length).toBe(1);

      // ensure pingCheck returns a promise-like value
      mockHttp.pingCheck.mockResolvedValue({ status: "ok" });

      // invoke the provided health indicator function
      return fns[0]() as Promise<any>;
    });

    const res = await controller.checkReadiness();

    expect(mockHealth.check).toHaveBeenCalled();
    expect(mockHttp.pingCheck).toHaveBeenCalledWith(
      "data-service",
      `${mockEnv.dataService.baseUrl}/actuator/health/liveness`,
    );
    expect(res).toEqual({ status: "ok" });
  });

  it("checkReadiness should still call pingCheck if baseUrl has trailing slash", async () => {
    mockEnv.dataService.baseUrl = "http://datasvc/";

    mockHealth.check.mockImplementation((fns: (() => Promise<any>)[]) => {
      mockHttp.pingCheck.mockResolvedValue({ status: "ok" });
      return fns[0]() as Promise<any>;
    });

    await controller.checkReadiness();

    expect(mockHttp.pingCheck).toHaveBeenCalledWith(
      "data-service",
      `${mockEnv.dataService.baseUrl}/actuator/health/liveness`,
    );
  });
});
