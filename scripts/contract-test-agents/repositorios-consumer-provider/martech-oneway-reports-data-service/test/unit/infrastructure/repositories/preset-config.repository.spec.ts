import { Test, TestingModule } from "@nestjs/testing";
import { PresetConfigRepository } from "@infrastructure/repositories/preset-config.repository";
import { FileLoaderService } from "@common/services/file-loader.service";
import path from "path";

describe("PresetConfigRepository", () => {
  let repository: PresetConfigRepository;
  let fileLoaderService: FileLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresetConfigRepository,
        {
          provide: FileLoaderService,
          useValue: {
            load: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<PresetConfigRepository>(PresetConfigRepository);
    fileLoaderService = module.get<FileLoaderService>(FileLoaderService);
  });

  describe("getByName", () => {
    it("should transform underscores to slashes and call fileLoaderService with correct path", async () => {
      const presetName = "finance_revenue_overview";
      const expectedFileName = "finance/revenue/overview.preset.js";
      const mockConfig = { id: "test-preset" };

      const loadSpy = jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(mockConfig);

      const result = await repository.getByName(presetName);
      expect(result).toEqual(mockConfig);

      const expectedPathSuffix = path.join(
        "dist",
        "src",
        "domain",
        "config",
        "presets",
        expectedFileName,
      );

      expect(loadSpy).toHaveBeenCalledWith(
        expect.stringContaining(expectedPathSuffix),
      );
    });

    it("should handle preset names without underscores", async () => {
      const presetName = "simple";
      const loadSpy = jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue({});

      await repository.getByName(presetName);

      const expectedPathSuffix = path.join("presets", "simple.preset.js");
      expect(loadSpy).toHaveBeenCalledWith(
        expect.stringContaining(expectedPathSuffix),
      );
    });

    it("should throw error if fileLoaderService fails", async () => {
      const error = new Error("File not found");
      jest.spyOn(fileLoaderService, "load").mockRejectedValue(error);

      await expect(repository.getByName("any")).rejects.toThrow(
        "File not found",
      );
    });
  });
});
