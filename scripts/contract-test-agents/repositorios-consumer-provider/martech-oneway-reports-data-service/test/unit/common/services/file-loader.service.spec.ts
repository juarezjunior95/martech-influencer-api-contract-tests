import { FileLoaderService } from "@common/services/file-loader.service";
import { Test, TestingModule } from "@nestjs/testing";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import fs from "fs";
import path from "path";

describe("FileLoaderService", () => {
  let service: FileLoaderService;
  let configService: EnvironmentConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileLoaderService,
        {
          provide: EnvironmentConfigService,
          useValue: {
            get env() {
              return "production";
            },
          },
        },
      ],
    }).compile();

    service = await module.resolve<FileLoaderService>(FileLoaderService);
    configService = await module.resolve(EnvironmentConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("load", () => {
    let readSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.spyOn(fs, "existsSync").mockReturnValue(true);

      readSpy = jest
        .spyOn(fs.promises, "readFile")
        .mockResolvedValue("SELECT * FROM table" as any);
    });

    it("should throw an error if file does not exist", async () => {
      jest.spyOn(fs, "existsSync").mockReturnValue(false);

      const filePath = "non-existent-file.txt";

      await expect(service.load(filePath)).rejects.toThrow(
        `File not found: ${filePath}`,
      );
    });

    it("should load and return .sql file content as string", async () => {
      const filePath = "query.sql";
      const content = "SELECT * FROM table";

      readSpy.mockResolvedValue(content as any);

      const result = await service.load<string>(filePath);

      expect(result).toBe(content);
      expect(readSpy).toHaveBeenCalledWith(filePath, "utf8");
    });

    it("should return cached content in production when called twice", async () => {
      const filePath = "query_production.sql";

      readSpy
        .mockResolvedValueOnce("SELECT 1" as any)
        .mockResolvedValueOnce("SELECT 2" as any);

      const firstResult = await service.load(filePath);
      const secondResult = await service.load(filePath);

      expect(firstResult).toBe("SELECT 1");
      expect(secondResult).toBe("SELECT 1");
      expect(readSpy).toHaveBeenCalledTimes(1);
    });

    it("should ignore cache and reload file when in development mode", async () => {
      const filePath = "query_development.sql";

      jest.spyOn(configService, "env", "get").mockReturnValue("development");

      readSpy
        .mockResolvedValueOnce("SELECT 1" as any)
        .mockResolvedValueOnce("SELECT 2" as any);

      const firstResult = await service.load(filePath);
      const secondResult = await service.load(filePath);

      expect(firstResult).toBe("SELECT 1");
      expect(secondResult).toBe("SELECT 2");
      expect(readSpy).toHaveBeenCalledTimes(2);
    });

    it("should log and rethrow error when loading fails", async () => {
      readSpy.mockRejectedValue(new Error("Read error"));

      const loggerSpy = jest
        .spyOn((service as any).logger, "error")
        .mockImplementation(() => {});

      await expect(service.load("error_fail.sql")).rejects.toThrow(
        "Read error",
      );

      expect(loggerSpy).toHaveBeenCalled();
    });
  });

  describe("loadFileByExt", () => {
    it("should handle .js/.ts files using dynamic import", async () => {
      const filePath = "/path/to/script.js";
      const mockModule = { default: { data: "mocked" } };

      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest.spyOn(path, "extname").mockReturnValue(".js");

      const loadSpy = jest
        .spyOn(service as any, "loadFileByExt")
        .mockResolvedValue(mockModule.default);

      const result = await service.load(filePath);

      expect(result).toEqual(mockModule.default);
      expect(loadSpy).toHaveBeenCalledWith(filePath);
    });
  });
});
