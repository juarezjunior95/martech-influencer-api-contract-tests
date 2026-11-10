import { Test, TestingModule } from "@nestjs/testing";
import { Logger } from "@nestjs/common";

import { DataSourceController } from "../../../../src/infrastructure/controllers/datasource.controller";
import { FetchDataSourceUseCase } from "../../../../src/application/usecases/fetch-datasource.usecase";
import { DataSourceFilterDto } from "../../../../src/infrastructure/controllers/dto/datasource-filter.dto";
import { DataSourceFilterDtoMapper } from "../../../../src/infrastructure/mappers/datasource-filter-dto.mapper";

describe("DataSourceController", () => {
  let controller: DataSourceController;
  let fetchDataSourceUseCase: jest.Mocked<FetchDataSourceUseCase>;

  const mockDataItems = [
    { id: 1, name: "Test Item 1", value: 100 },
    { id: 2, name: "Test Item 2", value: 200 },
  ];

  beforeEach(async () => {
    const mockFetchDataSourceUseCase = {
      execute: jest.fn(),
    };

    const mockHeaderContextService = {
      setHeaderContext: jest.fn(),
      getHeaderContext: jest.fn(),
      getRequestTraceId: jest.fn(),
      getCountry: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataSourceController],
      providers: [
        {
          provide: "FetchDataSourceUseCase",
          useValue: mockFetchDataSourceUseCase,
        },
        {
          provide: "IHeaderContextService",
          useValue: mockHeaderContextService,
        },
      ],
    }).compile();

    controller = module.get<DataSourceController>(DataSourceController);
    fetchDataSourceUseCase = module.get("FetchDataSourceUseCase");

    // Suppress logger output during tests
    jest.spyOn(Logger.prototype, "log").mockImplementation();
    jest.spyOn(Logger.prototype, "error").mockImplementation();
    jest.spyOn(Logger.prototype, "warn").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getDataSource", () => {
    it("should return datasource data successfully without filters", async () => {
      // Arrange
      const datasourceName = "test-datasource";
      const filterDto: DataSourceFilterDto = {};
      const expectedFilters = DataSourceFilterDtoMapper.toFilters(filterDto);

      fetchDataSourceUseCase.execute.mockResolvedValue(mockDataItems);

      // Act
      const result = await controller.getDataSource(datasourceName, filterDto);

      // Assert
      expect(fetchDataSourceUseCase.execute).toHaveBeenCalledWith({
        dataSourceName: datasourceName,
        filters: expectedFilters,
      });
      expect(fetchDataSourceUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        name: "test-datasource",
        data: [
          { id: 1, name: "Test Item 1", value: 100 },
          { id: 2, name: "Test Item 2", value: 200 },
        ],
      });
    });

    it("should return datasource data successfully with filters", async () => {
      // Arrange
      const datasourceName = "sales-datasource";
      const filterDto: DataSourceFilterDto = {
        filter: {
          country: "BRA",
          brand: "Corona",
        },
      };
      const expectedFilters = DataSourceFilterDtoMapper.toFilters(filterDto);

      fetchDataSourceUseCase.execute.mockResolvedValue(mockDataItems);

      // Act
      const result = await controller.getDataSource(datasourceName, filterDto);

      // Assert
      expect(fetchDataSourceUseCase.execute).toHaveBeenCalledWith({
        dataSourceName: datasourceName,
        filters: expectedFilters,
      });
      expect(fetchDataSourceUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        name: "sales-datasource",
        data: [
          { id: 1, name: "Test Item 1", value: 100 },
          { id: 2, name: "Test Item 2", value: 200 },
        ],
      });
    });

    it("should return empty data array when datasource has no data", async () => {
      // Arrange
      const datasourceName = "empty-datasource";
      const filterDto: DataSourceFilterDto = {};
      const emptyDataItems = [];

      fetchDataSourceUseCase.execute.mockResolvedValue(emptyDataItems);

      // Act
      const result = await controller.getDataSource(datasourceName, filterDto);

      // Assert
      expect(result).toEqual({
        name: "empty-datasource",
        data: [],
      });
    });

    it("should handle complex filter values", async () => {
      // Arrange
      const datasourceName = "complex-datasource";
      const filterDto: DataSourceFilterDto = {
        filter: {
          country: "USA",
          year: 2024,
          active: true,
          threshold: 50.5,
        },
      };
      const expectedFilters = DataSourceFilterDtoMapper.toFilters(filterDto);

      fetchDataSourceUseCase.execute.mockResolvedValue(mockDataItems);

      // Act
      const result = await controller.getDataSource(datasourceName, filterDto);

      // Assert
      expect(fetchDataSourceUseCase.execute).toHaveBeenCalledWith({
        dataSourceName: datasourceName,
        filters: expectedFilters,
      });
      expect(result).toBeDefined();
      expect(result.name).toBe("complex-datasource");
    });

    it("should propagate errors from use case", async () => {
      // Arrange
      const datasourceName = "error-datasource";
      const filterDto: DataSourceFilterDto = {};
      const error = new Error("Datasource not found");

      fetchDataSourceUseCase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.getDataSource(datasourceName, filterDto),
      ).rejects.toThrow("Datasource not found");
      expect(fetchDataSourceUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should handle datasource with special characters in name", async () => {
      // Arrange
      const datasourceName = "sales-data_2024-v1";
      const filterDto: DataSourceFilterDto = {};

      fetchDataSourceUseCase.execute.mockResolvedValue(mockDataItems);

      // Act
      const result = await controller.getDataSource(datasourceName, filterDto);

      // Assert
      expect(fetchDataSourceUseCase.execute).toHaveBeenCalledWith({
        dataSourceName: datasourceName,
        filters: [],
      });
      expect(result).toBeDefined();
    });

    it("should correctly map filter DTO to filters array", async () => {
      // Arrange
      const datasourceName = "mapped-datasource";
      const filterDto: DataSourceFilterDto = {
        filter: {
          region: "LATAM",
          quarter: "Q1",
        },
      };

      const spy = jest.spyOn(DataSourceFilterDtoMapper, "toFilters");
      fetchDataSourceUseCase.execute.mockResolvedValue(mockDataItems);

      // Act
      await controller.getDataSource(datasourceName, filterDto);

      // Assert
      expect(spy).toHaveBeenCalledWith(filterDto);
      spy.mockRestore();
    });

    it("should handle use case returning datasource with different data types", async () => {
      // Arrange
      const datasourceName = "mixed-types-datasource";
      const filterDto: DataSourceFilterDto = {};
      const mixedDataItems = [
        { id: 1, name: "Item", count: 10, active: true },
        { id: 2, name: "Another", count: 20, active: false },
      ];

      fetchDataSourceUseCase.execute.mockResolvedValue(mixedDataItems);

      // Act
      const result = await controller.getDataSource(datasourceName, filterDto);

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toHaveProperty("id");
      expect(result.data[0]).toHaveProperty("name");
      expect(result.data[0]).toHaveProperty("count");
      expect(result.data[0]).toHaveProperty("active");
    });

    it("should handle null or undefined filter gracefully", async () => {
      // Arrange
      const datasourceName = "test-datasource";
      const filterDto: DataSourceFilterDto = {
        filter: undefined,
      };

      fetchDataSourceUseCase.execute.mockResolvedValue(mockDataItems);

      // Act
      const result = await controller.getDataSource(datasourceName, filterDto);

      // Assert
      expect(fetchDataSourceUseCase.execute).toHaveBeenCalledWith({
        dataSourceName: datasourceName,
        filters: [],
      });
      expect(result).toBeDefined();
    });

    it("should handle empty filter object", async () => {
      // Arrange
      const datasourceName = "test-datasource";
      const filterDto: DataSourceFilterDto = {
        filter: {},
      };

      fetchDataSourceUseCase.execute.mockResolvedValue(mockDataItems);

      // Act
      const result = await controller.getDataSource(datasourceName, filterDto);

      // Assert
      expect(fetchDataSourceUseCase.execute).toHaveBeenCalledWith({
        dataSourceName: datasourceName,
        filters: [],
      });
      expect(result).toBeDefined();
    });
  });

  describe("Controller instantiation", () => {
    it("should be defined", () => {
      expect(controller).toBeDefined();
    });

    it("should have logger instance", () => {
      expect(controller["logger"]).toBeDefined();
    });

    it("should have fetchDataSourceUseCase injected", () => {
      expect(controller["fetchDataSourceUseCase"]).toBeDefined();
      expect(controller["fetchDataSourceUseCase"]).toBe(fetchDataSourceUseCase);
    });
  });
});
