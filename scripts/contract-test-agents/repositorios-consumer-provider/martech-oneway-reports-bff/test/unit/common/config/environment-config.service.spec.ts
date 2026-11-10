import { EnvironmentConfigService } from "@common/config/environment-config.service";

describe("EnvironmentConfigService", () => {
  it("should return dataService baseUrl from config service", () => {
    const mockConfig = {
      get: jest.fn().mockImplementation((key: string, def?: any) => {
        if (key === "DATA_SERVICE_BASE_URL") return "http://api";
        return def;
      }),
    } as any;

    const svc = new EnvironmentConfigService(mockConfig);

    expect(svc.dataService.baseUrl).toBe("http://api");
  });

  it("should return redis settings", () => {
    const mockConfig = {
      get: jest.fn().mockImplementation((_key: string) => {
        if (_key === "REDIS_HOST") return "localhost";
        if (_key === "REDIS_PORT") return 6379;
        if (_key === "REDIS_PASSWORD") return "pwd";
        return undefined;
      }),
    } as any;

    const svc = new EnvironmentConfigService(mockConfig);

    expect(svc.redis.host).toBe("localhost");
    expect(svc.redis.port).toBe(6379);
    expect(svc.redis.password).toBe("pwd");
  });

  it("should parse viewCache enabled flag", () => {
    const mockConfigTrue = {
      get: jest.fn().mockImplementation(() => "true"),
    } as any;
    const mockConfigFalse = {
      get: jest.fn().mockImplementation(() => "false"),
    } as any;

    expect(new EnvironmentConfigService(mockConfigTrue).viewCache.enabled).toBe(
      true,
    );
    expect(
      new EnvironmentConfigService(mockConfigFalse).viewCache.enabled,
    ).toBe(false);
  });
});
