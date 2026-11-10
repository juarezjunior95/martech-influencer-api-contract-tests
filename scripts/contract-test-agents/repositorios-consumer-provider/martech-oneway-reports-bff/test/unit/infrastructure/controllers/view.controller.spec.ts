import { Test, TestingModule } from "@nestjs/testing";
import { ViewController } from "@infrastructure/controllers/view.controller";
import { IProcessViewUseCase } from "@application/interfaces/process-view.usecase.interface";
import {
  validateProcessedViewResult,
  logTestStep,
} from "../../../mock/helpers";
import { ViewNotFoundError } from "@domain/exceptions/view-not-found.error";
import { ClearCacheUseCase } from "@application/usecases/clear-cache.usecase";

describe("ViewController - Integration Tests", () => {
  let controller: ViewController;
  let processViewUseCase: IProcessViewUseCase;
  let clearCacheUseCase: ClearCacheUseCase;

  beforeEach(async () => {
    // Setup: Create test module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewController],
      providers: [
        {
          provide: "ICachedProcessViewUseCase",
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: "ClearCacheUseCase",
          useValue: {
            execute: jest.fn().mockResolvedValue({ deletedCount: 1 }),
          },
        },
        {
          provide: "IHeaderContextService",
          useValue: {
            getHeaderContext: jest.fn(),
          },
        },
      ],
    }).compile();

    // Assign instances
    controller = module.get<ViewController>(ViewController);
    processViewUseCase = module.get("ICachedProcessViewUseCase");
    clearCacheUseCase = module.get("ClearCacheUseCase");
  });

  describe("getView", () => {
    it("✓ should return view data successfully", async () => {
      // Arrange
      const viewName = "portfolio-brand_overview";
      const mockResult = {
        view: viewName,
        components: [
          {
            id: "component-1",
            data: { result: "data1" },
          },
        ],
      };

      logTestStep("Configurando mock para getView");
      jest.spyOn(processViewUseCase, "execute").mockResolvedValue(mockResult);

      // Act
      const result = await controller.getView(viewName, {});

      // Assert
      validateProcessedViewResult(result);
      expect(result.view).toBe(viewName);
      expect(processViewUseCase.execute).toHaveBeenCalledWith(viewName, []);

      logTestStep("View retornada com sucesso", {
        view: result.view,
        components: result.components.length,
      });
    });

    it("✓ should process filters and convert them to FilterSets", async () => {
      // Arrange
      const viewName = "test-view";
      const filters = {
        filter: {
          country: "BRA",
          brand: "Corona",
        },
      };

      const mockResult = {
        view: viewName,
        components: [],
      };

      jest.spyOn(processViewUseCase, "execute").mockResolvedValue(mockResult);

      // Act
      logTestStep("Executing getView with filters");
      await controller.getView(viewName, filters as any);

      // Assert
      expect(processViewUseCase.execute).toHaveBeenCalledWith(
        viewName,
        expect.any(Array),
      );

      logTestStep("Filters have been processed");
    });

    it("✓ should handle ViewNotFoundError", async () => {
      // Arrange
      const viewName = "non-existent-view";

      jest
        .spyOn(processViewUseCase, "execute")
        .mockRejectedValue(new ViewNotFoundError(viewName));

      // Act & Assert
      logTestStep("Testing view not found error");
      await expect(controller.getView(viewName, {})).rejects.toThrow(
        ViewNotFoundError,
      );
    });

    it("✓ should return multiple components", async () => {
      // Arrange
      const viewName = "multi-component-view";
      const mockResult = {
        view: viewName,
        components: [
          { id: "component-1", data: { value: 100 } },
          { id: "component-2", data: { value: 200 } },
          { id: "component-3", data: { value: 300 } },
        ],
      };

      jest.spyOn(processViewUseCase, "execute").mockResolvedValue(mockResult);

      // Act
      const result = await controller.getView(viewName, {});

      // Assert
      expect(result.components).toHaveLength(3);
      expect(result.components[0].id).toBe("component-1");
      expect(result.components[1].id).toBe("component-2");
      expect(result.components[2].id).toBe("component-3");

      logTestStep("Múltiplos componentes retornados", {
        count: result.components.length,
      });
    });

    it("✓ should handle component errors individually", async () => {
      // Arrange
      const viewName = "view-with-errors";
      const mockResult = {
        view: viewName,
        components: [
          { id: "component-1", data: { value: 100 } },
          { id: "component-2", error: "Datasource unavailable" },
        ],
      };

      jest.spyOn(processViewUseCase, "execute").mockResolvedValue(mockResult);

      // Act
      const result = await controller.getView(viewName, {});

      // Assert
      expect(result.components).toHaveLength(2);
      expect(result.components[0].data).toBeDefined();
      expect(result.components[1].error).toBeDefined();

      logTestStep("Component errors have been fixed");
    });
  });

  describe("clearCache", () => {
    it("✓ should clear cache successfully with tags", async () => {
      // Arrange
      const tags = ["view-cache", "component-cache"];

      logTestStep("Configuring mock for clearCache");
      jest
        .spyOn(clearCacheUseCase, "execute")
        .mockResolvedValue({ deletedCount: 5 });

      // Act
      const result = await controller.clearCache({ tags });

      // Assert
      expect(result.deletedCount).toBe(5);
      expect(clearCacheUseCase.execute).toHaveBeenCalledWith(tags);

      logTestStep("Cache limpo com sucesso", {
        deletedCount: result.deletedCount,
      });
    });

    it("✓ should handle empty tags", async () => {
      // Arrange
      const tags: string[] = [];

      jest
        .spyOn(clearCacheUseCase, "execute")
        .mockResolvedValue({ deletedCount: 0 });

      // Act
      const result = await controller.clearCache({ tags });

      // Assert
      expect(result.deletedCount).toBe(0);

      logTestStep("Epty cache has been fixed");
    });

    it("✓ should return count of deleted cache entries", async () => {
      // Arrange
      const tags = ["portfolio-brand", "overview"];

      jest
        .spyOn(clearCacheUseCase, "execute")
        .mockResolvedValue({ deletedCount: 10 });

      // Act
      const result = await controller.clearCache({ tags });

      // Assert
      expect(result).toHaveProperty("deletedCount");
      expect(typeof result.deletedCount).toBe("number");

      logTestStep("Cache count redturned correctly");
    });
  });

  describe("Parameter Validation", () => {
    it("✓ should accept view name parameter", async () => {
      // Arrange
      const viewName = "valid-view-name";
      const mockResult = { view: viewName, components: [] };

      jest.spyOn(processViewUseCase, "execute").mockResolvedValue(mockResult);

      // Act
      const result = await controller.getView(viewName, {});

      // Assert
      expect(result.view).toBe(viewName);
      expect(processViewUseCase.execute).toHaveBeenCalledWith(viewName, []);
    });

    it("✓ should handle empty filters object", async () => {
      // Arrange
      const viewName = "test-view";
      const mockResult = { view: viewName, components: [] };

      jest.spyOn(processViewUseCase, "execute").mockResolvedValue(mockResult);

      // Act
      const result = await controller.getView(viewName, {});

      // Assert
      expect(result.view).toBe(viewName);

      logTestStep("Empty filters have been fixed");
    });

    it("✓ should handle deeply nested filters", async () => {
      // Arrange
      const viewName = "test-view";
      const filters = {
        filter: {
          country: "BRA",
          brand: "Corona",
          region: {
            state: "SP",
            city: "São Paulo",
          },
        },
      };

      const mockResult = { view: viewName, components: [] };

      jest.spyOn(processViewUseCase, "execute").mockResolvedValue(mockResult);

      // Act
      const result = await controller.getView(viewName, filters as any);

      // Assert
      expect(result.view).toBe(viewName);
      expect(processViewUseCase.execute).toHaveBeenCalled();

      logTestStep("Nested filters have been processed");
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
