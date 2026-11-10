jest.mock("newrelic", () => ({
  addCustomAttribute: jest.fn(),
}));

import { CachedProcessViewUseCase } from "@application/usecases/cached-process-view.usecase";
import newrelic from "newrelic";

describe("CachedProcessViewUseCase", () => {
  let usecase: CachedProcessViewUseCase;
  let processViewUseCase: any;
  let viewCacheRepository: any;
  let userRepository: any;
  let environmentConfig: any;

  const makeViewEntity = (cacheEnabled = true) => ({
    getCacheConfig: () => ({ enabled: cacheEnabled }),
    getView: () => "test-view",
  });

  const makeProcessedResult = (withError = false) => ({
    view: "test-view",
    components: withError
      ? [{ id: "c1", error: "fail" }]
      : [{ id: "c1", data: {} }],
  });

  beforeEach(() => {
    processViewUseCase = {
      createViewEntity: jest.fn(),
      processViewEntity: jest.fn(),
    };

    viewCacheRepository = {
      getView: jest.fn(),
      setView: jest.fn(),
    };

    userRepository = {
      getCurrentUser: jest.fn().mockResolvedValue({ id: "user-1" }),
    };

    environmentConfig = { viewCache: { enabled: true } };

    usecase = new CachedProcessViewUseCase(
      processViewUseCase,
      viewCacheRepository,
      userRepository,
      environmentConfig,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it("bypasses cache when global view cache is disabled", async () => {
    environmentConfig.viewCache.enabled = false;

    const viewEntity = makeViewEntity(true);
    processViewUseCase.createViewEntity.mockResolvedValue(viewEntity);
    const processed = makeProcessedResult(false);
    processViewUseCase.processViewEntity.mockResolvedValue(processed);

    const result = await usecase.execute("test-view", []);

    expect(processViewUseCase.createViewEntity).toHaveBeenCalledWith(
      "test-view",
      [],
    );
    expect((newrelic as any).addCustomAttribute).toHaveBeenCalledWith(
      "view.cache.hit",
      false,
    );
    expect(result).toBe(processed);
    expect(viewCacheRepository.getView).not.toHaveBeenCalled();
  });

  it("returns cached result when cache hit", async () => {
    const viewEntity = makeViewEntity(true);
    processViewUseCase.createViewEntity.mockResolvedValue(viewEntity);

    const cached = makeProcessedResult(false);
    viewCacheRepository.getView.mockResolvedValue(cached);

    const logSpy = jest.spyOn((usecase as any).logger, "log");

    const result = await usecase.execute("test-view");

    expect((newrelic as any).addCustomAttribute).toHaveBeenCalledWith(
      "view.cache.hit",
      true,
    );
    expect(viewCacheRepository.getView).toHaveBeenCalledWith(viewEntity, {
      id: "user-1",
    });
    expect(processViewUseCase.processViewEntity).not.toHaveBeenCalled();
    expect(result).toBe(cached);
    expect(logSpy).toHaveBeenCalledWith("Cache hit for view 'test-view'");
  });

  it("does not cache result when components have errors", async () => {
    const viewEntity = makeViewEntity(true);
    processViewUseCase.createViewEntity.mockResolvedValue(viewEntity);

    viewCacheRepository.getView.mockResolvedValue(null);

    const processedWithError = makeProcessedResult(true);
    processViewUseCase.processViewEntity.mockResolvedValue(processedWithError);

    const warnSpy = jest.spyOn((usecase as any).logger, "warn");

    const result = await usecase.execute("test-view");

    expect((newrelic as any).addCustomAttribute).toHaveBeenCalledWith(
      "view.cache.hit",
      false,
    );
    expect(processViewUseCase.processViewEntity).toHaveBeenCalledWith(
      viewEntity,
    );
    expect(viewCacheRepository.setView).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      "Not caching view 'test-view' due to component errors",
    );
    expect(result).toBe(processedWithError);
  });

  it("saves to cache when no component errors and logs cached message (cacheSaved true)", async () => {
    const viewEntity = makeViewEntity(true);
    processViewUseCase.createViewEntity.mockResolvedValue(viewEntity);

    viewCacheRepository.getView.mockResolvedValue(null);

    const processed = makeProcessedResult(false);
    processViewUseCase.processViewEntity.mockResolvedValue(processed);

    viewCacheRepository.setView.mockResolvedValue(true);

    const logSpy = jest.spyOn((usecase as any).logger, "log");

    const result = await usecase.execute("test-view");

    expect(viewCacheRepository.setView).toHaveBeenCalledWith(
      viewEntity,
      { id: "user-1" },
      processed,
    );
    expect(logSpy).toHaveBeenCalledWith(
      "View 'test-view' processed and cached",
    );
    expect(result).toBe(processed);
  });

  it("logs (cache not saved) when setView returns false", async () => {
    const viewEntity = makeViewEntity(true);
    processViewUseCase.createViewEntity.mockResolvedValue(viewEntity);

    viewCacheRepository.getView.mockResolvedValue(null);

    const processed = makeProcessedResult(false);
    processViewUseCase.processViewEntity.mockResolvedValue(processed);

    viewCacheRepository.setView.mockResolvedValue(false);

    const logSpy = jest.spyOn((usecase as any).logger, "log");

    const result = await usecase.execute("test-view");

    expect(viewCacheRepository.setView).toHaveBeenCalledWith(
      viewEntity,
      { id: "user-1" },
      processed,
    );
    expect(logSpy).toHaveBeenCalledWith(
      "View 'test-view' processed (cache not saved)",
    );
    expect(result).toBe(processed);
  });

  it("delegates createViewEntity and processViewEntity", async () => {
    const viewEntity = makeViewEntity(true);
    processViewUseCase.createViewEntity.mockResolvedValue(viewEntity);
    processViewUseCase.processViewEntity.mockResolvedValue(
      makeProcessedResult(false),
    );

    const created = await usecase.createViewEntity("v", []);
    expect(processViewUseCase.createViewEntity).toHaveBeenCalledWith("v", []);
    expect(created).toBe(viewEntity);

    const processed = await usecase.processViewEntity(viewEntity as any);
    expect(processViewUseCase.processViewEntity).toHaveBeenCalledWith(
      viewEntity,
    );
    expect(processed).toEqual(makeProcessedResult(false));
  });

  it("hasComponentErrors returns false for invalid shapes", () => {
    const fn = (usecase as any).hasComponentErrors.bind(usecase);

    expect(fn(undefined)).toBe(false);
    expect(fn(null)).toBe(false);
    expect(fn({})).toBe(false);
    expect(fn({ components: "not-an-array" })).toBe(false);
    expect(fn({ components: [] })).toBe(false);
  });
});
