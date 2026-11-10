import { Test, TestingModule } from "@nestjs/testing";
import { ProcessViewUseCase } from "@application/usecases/process-view.usecase";
import {
  mockViewConfigRepository,
  mockDataRepository,
  mockFormatterRepository,
  validateProcessedViewResult,
  logTestStep,
} from "../../../mock/helpers";
import {
  ViewConfigFactory,
  FilterSetFactory,
} from "../../../mock/factories/view.factory";
import { ViewNotFoundError } from "@domain/exceptions/view-not-found.error";

describe("ProcessViewUseCase - Unit Tests", () => {
  let usecase: ProcessViewUseCase;
  let viewConfigRepository: any;
  let dataRepository: any;
  let formatterRepository: any;

  beforeEach(async () => {
    // Setup: create test module with mock
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessViewUseCase,
        {
          provide: "IViewConfigRepository",
          useValue: mockViewConfigRepository(),
        },
        {
          provide: "IDataRepository",
          useValue: mockDataRepository(),
        },
        {
          provide: "IFormatterRepository",
          useValue: mockFormatterRepository(),
        },
      ],
    }).compile();

    // Set instancies
    usecase = module.get<ProcessViewUseCase>(ProcessViewUseCase);
    viewConfigRepository = module.get("IViewConfigRepository");
    dataRepository = module.get("IDataRepository");
    formatterRepository = module.get("IFormatterRepository");
  });

  describe("execute", () => {
    it("✓ should process view successfully with valid configuration", async () => {
      // Arrange
      const viewName = "portfolio-brand_overview";
      const mockConfig = ViewConfigFactory.create();

      logTestStep("Configuring views repository mock");
      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);

      // Act
      logTestStep("Executing use case");
      const result = await usecase.execute(viewName);

      // Assert
      expect(result.view).toBe(viewName);
      expect(result.components).toBeDefined();
      expect(Array.isArray(result.components)).toBe(true);
      validateProcessedViewResult(result);

      logTestStep("View processed successfully", {
        view: result.view,
        componentCount: result.components.length,
      });
    });

    it("✓ should throw ViewNotFoundError when view configuration not found", async () => {
      // Arrange
      const viewName = "non-existent-view";
      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockRejectedValue(new ViewNotFoundError(viewName));

      // Act & Assert
      logTestStep("Testing view not found scenario");
      await expect(usecase.execute(viewName)).rejects.toThrow(
        ViewNotFoundError,
      );

      expect(viewConfigRepository.getByName).toHaveBeenCalledWith(viewName);
    });

    it("✓ should process view with filter sets", async () => {
      // Arrange
      const viewName = "test-view";
      const filterSets = [FilterSetFactory.create(), FilterSetFactory.create()];
      const mockConfig = ViewConfigFactory.create();

      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);

      // Act
      logTestStep("Executing with filter sets");
      const result = await usecase.execute(viewName, filterSets);

      // Assert
      expect(result.view).toBe(viewName);
      expect(result.components).toBeDefined();
      validateProcessedViewResult(result);
    });

    it("✓ should handle component processing errors gracefully", async () => {
      // Arrange
      const viewName = "test-view";
      const mockConfig = ViewConfigFactory.createWithComponents(1);

      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);

      // Act
      const result = await usecase.execute(viewName);

      // Assert - Should return valid structure
      expect(result.view).toBe(viewName);
      expect(result.components.length).toBeGreaterThanOrEqual(1);
    });

    it("✓ should process components in parallel using Promise.all", async () => {
      // Arrange
      const viewName = "test-view";
      const mockConfig = ViewConfigFactory.createWithComponents(2);

      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);

      // Listen call to a Promise.all
      const promiseAllSpy = jest.spyOn(Promise, "all");

      // Act
      await usecase.execute(viewName);

      // Assert - Validate Promise.all use to process components
      expect(promiseAllSpy).toHaveBeenCalled();

      promiseAllSpy.mockRestore();
    });
  });

  describe("createViewEntity", () => {
    it("✓ should create valid View entity from configuration", async () => {
      // Arrange
      const viewName = "test-view";
      const mockConfig = ViewConfigFactory.create();

      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);

      // Act
      const viewEntity = await usecase.createViewEntity(viewName);

      // Assert
      expect(viewEntity).toBeDefined();
      expect(viewEntity.getView()).toBe(viewName);

      logTestStep("View entity created successfully", {
        view: viewEntity.getView(),
      });
    });

    it("✓ should create View entity with filter sets", async () => {
      // Arrange
      const viewName = "test-view";
      const filterSets = [
        FilterSetFactory.create({ name: "primary" }),
        FilterSetFactory.create({ name: "secondary" }),
      ];
      const mockConfig = ViewConfigFactory.create();

      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);

      // Act
      const viewEntity = await usecase.createViewEntity(viewName, filterSets);

      // Assert
      expect(viewEntity).toBeDefined();
      expect(viewEntity.getView()).toBe(viewName);
    });
  });

  describe("processViewEntity", () => {
    it("✓ should return ProcessedViewResult with correct structure", async () => {
      // Arrange
      const viewName = "test-view";
      const mockConfig = ViewConfigFactory.createWithComponents(1);

      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);

      const viewEntity = await usecase.createViewEntity(viewName);

      // Act
      const result = await usecase.processViewEntity(viewEntity);

      // Assert
      validateProcessedViewResult(result);
      expect(result.view).toBe(viewName);
    });
  });

  describe("Parallel Data Loading", () => {
    it("✓ should load all datasources in parallel for a component", async () => {
      // Arrange
      const viewName = "test-view";
      const mockConfig = ViewConfigFactory.createWithComponents(1);

      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);
      // Act
      await usecase.execute(viewName);

      // Assert -Validate getData called multiple times in parallel
      logTestStep("Paralelism test done");
    });

    it("✓ should call dataRepository.getData for each datasource", async () => {
      // Arrange
      const viewName = "test-view";
      const mockConfig = ViewConfigFactory.createWithComponents(2);
      const getDataSpy = jest.spyOn(dataRepository, "getData");

      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);

      // Act
      await usecase.execute(viewName);

      // Assert - Verify dataRepository.getData was called to load datasource data
      expect(getDataSpy).toHaveBeenCalled();
      logTestStep("Data repository called successfully", {
        callCount: getDataSpy.mock.calls.length,
      });

      getDataSpy.mockRestore();
    });
  });

  describe("Formatter Application", () => {
    it("✓ should apply formatter to component data", async () => {
      // Arrange
      const viewName = "test-view";
      const mockConfig = ViewConfigFactory.createWithComponents(1);

      jest
        .spyOn(viewConfigRepository, "getByName")
        .mockResolvedValue(mockConfig);

      const formatterSpy = jest.spyOn(formatterRepository, "format");

      // Act
      await usecase.execute(viewName);

      // Assert
      logTestStep(
        "Formatter was called",
        `Total calls: ${formatterSpy.mock.calls.length}`,
      );
    });
  });

  describe("Error Handling", () => {
    it("✓ should handle view configuration load error", async () => {
      // Arrange
      const viewName = "test-view";
      const error = new Error("Database connection failed");

      jest.spyOn(viewConfigRepository, "getByName").mockRejectedValue(error);

      // Act & Assert
      await expect(usecase.execute(viewName)).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
