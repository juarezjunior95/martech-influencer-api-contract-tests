import { ClearCacheUseCase } from "@application/usecases/clear-cache.usecase";

describe("ClearCacheUseCase", () => {
  let usecase: ClearCacheUseCase;
  let mockViewRepo: { invalidateByTags: jest.Mock };
  let mockPresetRepo: { invalidateByTags: jest.Mock };

  beforeEach(() => {
    mockViewRepo = { invalidateByTags: jest.fn() };
    mockPresetRepo = { invalidateByTags: jest.fn() };
    usecase = new ClearCacheUseCase(mockViewRepo as any, mockPresetRepo as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("invalidates cache and logs deleted count", async () => {
    const tags = ["tagA", "tagB"];
    mockViewRepo.invalidateByTags.mockResolvedValue(7);
    mockPresetRepo.invalidateByTags.mockResolvedValue(3);

    const loggerSpy = jest.spyOn((usecase as any).logger, "log");

    const result = await usecase.execute(tags);

    expect(mockViewRepo.invalidateByTags).toHaveBeenCalledWith(tags);
    expect(result).toEqual({ deletedCount: 10 });
    expect(loggerSpy).toHaveBeenCalledWith(
      `Cache cleared for tags [${tags.join(", ")}]: 10 keys deleted`,
    );
  });

  it("propagates errors from repository", async () => {
    const tags = ["only"];
    const err = new Error("redis unavailable");
    mockViewRepo.invalidateByTags.mockRejectedValue(err);

    await expect(usecase.execute(tags)).rejects.toThrow(err);
  });
});
