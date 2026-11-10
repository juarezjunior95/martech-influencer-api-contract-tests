import { ViewCacheRepository } from "@infrastructure/repositories/view-cache.repository";

describe("ViewCacheRepository", () => {
  let repo: ViewCacheRepository;
  const mockRedis: any = {
    isOffline: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    invalidateByTags: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new ViewCacheRepository(mockRedis as any);
  });

  function makeView(name = "v", filterSets: any[] = [], tags: string[] = []) {
    return {
      getView: () => name,
      getFilterSets: () => filterSets,
      getCacheConfig: () => ({ tags }),
    } as any;
  }

  function makeUser(scopes: string[] = []) {
    return {
      getScopes: (sorted?: boolean) => (sorted ? [...scopes].sort() : scopes),
    } as any;
  }

  it("getView returns null when redis offline", async () => {
    mockRedis.isOffline.mockReturnValue(true);
    const v = makeView();
    const res = await repo.getView(v);
    expect(res).toBeNull();
  });

  it("getView returns parsed json when present", async () => {
    mockRedis.isOffline.mockReturnValue(false);
    mockRedis.get.mockResolvedValue(JSON.stringify({ a: 1 }));
    const res = await repo.getView(makeView());
    expect(res).toEqual({ a: 1 });
  });

  it("getView returns null on parse error", async () => {
    mockRedis.isOffline.mockReturnValue(false);
    mockRedis.get.mockResolvedValue("notjson");
    const res = await repo.getView(makeView());
    expect(res).toBeNull();
  });

  it("setView returns false when redis offline", async () => {
    mockRedis.isOffline.mockReturnValue(true);
    const ok = await repo.setView(makeView(), null, { a: 1 });
    expect(ok).toBe(false);
  });

  it("setView stores data and returns true", async () => {
    mockRedis.isOffline.mockReturnValue(false);
    mockRedis.set.mockResolvedValue("OK");
    const view = makeView("v", [{ f: 1 }], ["t1"]);
    const user = makeUser(["OneWayReports.x"]);
    const ok = await repo.setView(view as any, user as any, { x: 1 }, 123);
    expect(ok).toBe(true);
    expect(mockRedis.set).toHaveBeenCalled();
    const calledWith = mockRedis.set.mock.calls[0];
    // According to implementation: set(cacheKey, serializedData, ttl, cacheTags)
    expect(calledWith[2]).toBe(123);
    // tags should be prefixed with view:
    expect(calledWith[3]).toContain("view:t1");
  });

  it("setView with no filters and no user uses base key and empty tags", async () => {
    mockRedis.isOffline.mockReturnValue(false);
    mockRedis.set.mockResolvedValue("OK");
    const view = makeView("plain", [], []);
    const ok = await repo.setView(view as any, null, { x: 1 });
    expect(ok).toBe(true);
    const calledWith = mockRedis.set.mock.calls[0];
    // key should start with view:
    expect(calledWith[0]).toMatch(/^view:/);
    // ttl default is provided as 2592000 (30 days)
    expect(calledWith[2]).toBe(2592000);
    // tags empty array
    expect(calledWith[3]).toEqual([]);
  });

  it("invalidateByTags should throw when redis errors", async () => {
    mockRedis.invalidateByTags.mockRejectedValue(new Error("boom"));
    await expect(repo.invalidateByTags(["x"])).rejects.toThrow("boom");
  });

  it("buildCacheKey and buildCacheTags private helpers", () => {
    const viewNoFilters = makeView("no", [], []);
    const key1 = (repo as any).buildCacheKey(viewNoFilters, null);
    expect(key1).toBe("view:no");

    const viewWithFilters = makeView("f", [{ a: 1 }], []);
    const key2 = (repo as any).buildCacheKey(viewWithFilters, null);
    expect(key2.startsWith("view:f:filters:")).toBe(true);

    const userNoScopes = makeUser([]);
    const key3 = (repo as any).buildCacheKey(
      viewWithFilters,
      userNoScopes as any,
    );
    // still should not have user-scopes part
    expect(key3.includes("user-scopes:")).toBe(false);

    const viewWithTags = makeView("t", [], ["a", "b"]);
    const tags = (repo as any).buildCacheTags(viewWithTags);
    expect(tags).toEqual(["view:a", "view:b"]);

    const viewNoTags = makeView("n", [], []);
    const tags2 = (repo as any).buildCacheTags(viewNoTags);
    expect(tags2).toEqual([]);
  });

  it("addPrefixToTag and createHash helpers", () => {
    const pref = (repo as any).addPrefixToTag("zzz");
    expect(pref).toBe("view:zzz");

    const hash = (repo as any).createHash("data");
    expect(typeof hash).toBe("string");
    expect(hash.length).toBe(64);
  });

  it("getView handles redis.get throwing error and returns null", async () => {
    mockRedis.isOffline.mockReturnValue(false);
    mockRedis.get.mockRejectedValue(new Error("boom-get"));
    const res = await repo.getView(makeView());
    expect(res).toBeNull();
  });

  it("getView returns null when no cached data present", async () => {
    mockRedis.isOffline.mockReturnValue(false);
    mockRedis.get.mockResolvedValue(null);
    const res = await repo.getView(makeView());
    expect(res).toBeNull();
  });

  it("setView returns false when redis.set throws", async () => {
    mockRedis.isOffline.mockReturnValue(false);
    mockRedis.set.mockRejectedValue(new Error("set-fail"));
    const ok = await repo.setView(makeView(), null, { x: 1 });
    expect(ok).toBe(false);
  });

  it("invalidateByTags with empty returns 0", async () => {
    mockRedis.invalidateByTags.mockResolvedValue(0);
    const res = await repo.invalidateByTags([]);
    expect(res).toBe(0);
  });

  it("invalidateByTags calls redis with prefixed tags", async () => {
    mockRedis.invalidateByTags.mockResolvedValue(5);
    const res = await repo.invalidateByTags(["a", "b"]);
    expect(mockRedis.invalidateByTags).toHaveBeenCalledWith([
      "view:a",
      "view:b",
    ]);
    expect(res).toBe(5);
  });
});
