import { Test, TestingModule } from "@nestjs/testing";
import { DatabricksDataRepository } from "@infrastructure/repositories/databricks-data.repository";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import { FileLoaderService } from "@common/services/file-loader.service";
import { Filter } from "@domain/entities/datasource.entity";
import {
  createDeltalakeProcedureFetchDataConfig,
  DeltalakeExecutionType,
  DeltalakeFetchDataConfig,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import { DBSQLParameter } from "@databricks/sql";
import { KpiEntity } from "@domain/entities/kpi.entity";

describe("DatabricksDataRepository", () => {
  let repository: DatabricksDataRepository;
  let fileLoaderService: FileLoaderService;

  const mockExecuteQuery = jest.fn();
  const mockEnvConfigService = {
    databricks: {
      sqlPlaceholders: {
        DATABRICKS_SCHEMA: "gold_common",
        KPI_TABLE: "gold_common.tlh_kpis_freeze_agg",
      },
    },
  };

  const parseProcedureJsonAfterSqlProcessing = (query: string) => {
    const payload = query.match(/'(\{[\s\S]*\})'/)?.[1];

    if (!payload) {
      throw new Error("Procedure JSON payload was not found");
    }

    return JSON.parse(payload.replaceAll("\\\\", "\\").replaceAll("\\'", "'"));
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabricksDataRepository,
        {
          provide: "DatabricksClient",
          useValue: {
            executeQuery: mockExecuteQuery,
          },
        },
        {
          provide: EnvironmentConfigService,
          useValue: mockEnvConfigService,
        },
        {
          provide: FileLoaderService,
          useValue: {
            load: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<DatabricksDataRepository>(DatabricksDataRepository);
    fileLoaderService = module.get<FileLoaderService>(FileLoaderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchData", () => {
    const mockFilters: Filter[] = [
      { name: "country", value: "BR" },
      { name: "year", value: 2024 },
    ];

    const mockProviderConfig: DeltalakeFetchDataConfig = {
      type: RepositoryType.deltalake,
      query: "test-query",
    };

    const mockProcedureProviderConfig: DeltalakeFetchDataConfig = {
      type: RepositoryType.deltalake,
      procedure: "reporting.sp_test_query",
      parameters: ["country", "year"],
      executionType: DeltalakeExecutionType.procedure,
    };

    const mockSqlContent =
      "SELECT * FROM {{KPI_TABLE}} WHERE country = :country";
    const expectedSqlProcessed =
      "SELECT * FROM gold_common.tlh_kpis_freeze_agg WHERE country = :country";
    const mockQueryResult = [{ id: 1, name: "Test 1", country: "BR" }];

    beforeEach(() => {
      jest.spyOn(fileLoaderService, "load").mockResolvedValue(mockSqlContent);
      mockExecuteQuery.mockResolvedValue(mockQueryResult);
    });

    it("should successfully fetch data with valid config and filters", async () => {
      const result = await repository.fetchData(
        mockProviderConfig,
        mockFilters,
      );

      expect(result).toEqual(mockQueryResult);
      expect(fileLoaderService.load).toHaveBeenCalledWith(
        expect.stringContaining("test-query.sql"),
      );
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expectedSqlProcessed,
        expect.any(Object),
      );
    });

    it("should convert filters to named parameters correctly", async () => {
      await repository.fetchData(mockProviderConfig, mockFilters);

      const calledParams = mockExecuteQuery.mock.calls[0][1];
      expect(calledParams.country).toBeInstanceOf(DBSQLParameter);
      expect(calledParams.year).toBeInstanceOf(DBSQLParameter);
    });

    it("should inject procedure environment when datasource opts in", async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "uat";

      try {
        await repository.fetchData(
          {
            ...mockProviderConfig,
            injectProcedureEnvironment: true,
          },
          [...mockFilters, { name: "environment", value: "PRD" }],
        );

        const calledParams = mockExecuteQuery.mock.calls[0][1];
        expect(calledParams.environment).toBeInstanceOf(DBSQLParameter);
        expect(calledParams.environment.value).toBe("UAT");
      } finally {
        process.env.NODE_ENV = originalNodeEnv;
      }
    });

    it("should handle empty filters array", async () => {
      await repository.fetchData(mockProviderConfig, []);

      expect(mockExecuteQuery).toHaveBeenCalledWith(expectedSqlProcessed, {});
    });

    it("should execute stored procedure configs without loading a SQL file", async () => {
      const result = await repository.fetchData(
        mockProcedureProviderConfig,
        mockFilters,
      );

      expect(result).toEqual(mockQueryResult);
      expect(fileLoaderService.load).not.toHaveBeenCalled();
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "CALL reporting.sp_test_query(:country, :year)",
        expect.any(Object),
      );
    });

    it("should use incoming filter order when procedure parameters are omitted", async () => {
      const procedureConfig: DeltalakeFetchDataConfig = {
        type: RepositoryType.deltalake,
        procedure: "reporting.sp_test_query",
      };

      await repository.fetchData(procedureConfig, mockFilters);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "CALL reporting.sp_test_query(:country, :year)",
        expect.any(Object),
      );
    });

    it("should execute result-query procedure configs with an inlined JSON payload", async () => {
      const procedureConfig = createDeltalakeProcedureFetchDataConfig({
        functionName: "4_innovation_home_overtime-performance",
        parameters: ["dt_end", "viewtype", "country"],
      });

      await repository.fetchData(procedureConfig, [
        { name: "dt_end", value: "2026-04-01" },
        { name: "viewtype", value: "country" },
        { name: "country", value: "BRA" },
      ]);

      const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];
      expect(calledQuery).toBe(
        `CALL gold_common.owr_result_query_sp(\n` +
          `          '4_innovation_home_overtime-performance',\n` +
          `          '{"dt_end": "2026-04-01", "viewtype": "country", "country": "BRA", "environment": "PRD"}'\n` +
          `        );`,
      );
      expect(calledParams).toEqual({});
    });

    it("should accept a full CALL statement for procedure configs and inline matching markers", async () => {
      const procedureConfig: DeltalakeFetchDataConfig = {
        type: RepositoryType.deltalake,
        procedure: "CALL reporting.sp_test_query(:country)",
        executionType: DeltalakeExecutionType.procedure,
      };

      await repository.fetchData(procedureConfig, mockFilters);

      const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];
      expect(calledQuery).toBe(`CALL reporting.sp_test_query("BR")`);
      expect(Object.keys(calledParams)).toEqual(["year"]);
      expect(calledParams.year).toBeInstanceOf(DBSQLParameter);
    });

    it("should replace placeholders in SQL correctly", async () => {
      const sqlWithPlaceholder = "SELECT * FROM {{KPI_TABLE}}";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithPlaceholder);

      await repository.fetchData(mockProviderConfig, []);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM gold_common.tlh_kpis_freeze_agg",
        {},
      );
    });

    it("should log a warning for unknown placeholders and keep them", async () => {
      const sqlWithUnknown = "SELECT * FROM {{UNKNOWN_VAR}}";
      jest.spyOn(fileLoaderService, "load").mockResolvedValue(sqlWithUnknown);
      const loggerSpy = jest.spyOn((repository as any).logger, "warn");

      await repository.fetchData(mockProviderConfig, []);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining("Unknown placeholder: UNKNOWN_VAR"),
      );
      expect(mockExecuteQuery).toHaveBeenCalledWith(sqlWithUnknown, {});
    });

    it("should throw error when fileLoaderService fails", async () => {
      jest
        .spyOn(fileLoaderService, "load")
        .mockRejectedValue(new Error("File not found"));

      const loggerSpy = jest
        .spyOn((repository as any).logger, "error")
        .mockImplementation(() => {});

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow("File not found");

      expect(loggerSpy).toHaveBeenCalled();
    });

    it("should throw error when query execution fails", async () => {
      mockExecuteQuery.mockRejectedValue(new Error("Query execution failed"));

      const loggerSpy = jest
        .spyOn((repository as any).logger, "error")
        .mockImplementation(() => {});

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow("Query execution failed");

      expect(loggerSpy).toHaveBeenCalled();
    });

    it("should map results to entity class if provided", async () => {
      class MockEntity extends KpiEntity {
        id: number;
        constructor(data: any) {
          super(data);
          Object.assign(this, data);
        }
      }

      const result = await repository.fetchData(
        mockProviderConfig,
        [],
        MockEntity,
      );

      expect(result[0]).toBeInstanceOf(MockEntity);
      expect(result[0].id).toBe(1);
    });

    describe("inline procedure parameter substitution", () => {
      const mockProcedureTemplate =
        `CALL mock_schema.mock_procedure(\n` +
        `  'mock_function_name',\n` +
        `  '{"mock_param_one": :mock_param_one, "mock_param_two": :mock_param_two}'\n` +
        `);`;

      it("should inline matching :marker tokens with quoted values and drop them from named parameters (golden path)", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: mockProcedureTemplate,
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, [
          { name: "mock_param_one", value: "mock-value-one" },
          { name: "mock_param_two", value: "mock-value-two" },
        ]);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toBe(
          `CALL mock_schema.mock_procedure(\n` +
            `  'mock_function_name',\n` +
            `  '{"mock_param_one": "mock-value-one", "mock_param_two": "mock-value-two"}'\n` +
            `);`,
        );
        expect(calledParams).toEqual({});
      });

      it("should leave the procedure untouched and pass empty named parameters when no filters are provided", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: mockProcedureTemplate,
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, []);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toBe(mockProcedureTemplate);
        expect(calledParams).toEqual({});
      });

      it("should keep filters that do not match any :marker as bound named parameters", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: mockProcedureTemplate,
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, [
          { name: "mock_param_one", value: "mock-value-one" },
          { name: "mock_param_two", value: "mock-value-two" },
          { name: "mock_unmatched_param", value: "mock-unmatched-value" },
        ]);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toBe(
          `CALL mock_schema.mock_procedure(\n` +
            `  'mock_function_name',\n` +
            `  '{"mock_param_one": "mock-value-one", "mock_param_two": "mock-value-two"}'\n` +
            `);`,
        );
        expect(Object.keys(calledParams)).toEqual(["mock_unmatched_param"]);
        expect(calledParams.mock_unmatched_param).toBeInstanceOf(
          DBSQLParameter,
        );
      });

      it("should prepend CALL and inline markers when the procedure is not prefixed by CALL", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: "mock_schema.mock_procedure(:country, :year)",
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, mockFilters);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toBe(
          `CALL mock_schema.mock_procedure("BR", "2024")`,
        );

        expect(calledParams).toEqual({});
      });

      it("should keep the SQL-literal escaping when a marker is a bare procedure argument", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: "mock_schema.mock_procedure(:brand)",
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, [
          { name: "brand", value: 'Say "hi"' },
        ]);

        const [calledQuery] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toBe(
          String.raw`CALL mock_schema.mock_procedure("Say \\"hi\\"")`,
        );
      });

      it("should normalize ytd-month preset period value Month to MTD when inlining", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: `'{"period": :period, "country": :country}'`,
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, [
          { name: "period", value: "Month" },
          { name: "country", value: "BRA" },
        ]);

        const [calledQuery] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toContain('"period": "MTD"');
        expect(calledQuery).toContain('"country": "BRA"');
      });

      it("should SQL-escape apostrophes in inlined JSON payload values (MARTLH-13017)", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: mockProcedureTemplate,
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, [
          { name: "mock_param_one", value: "Redd's" },
          { name: "mock_param_two", value: "Corona" },
        ]);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toBe(
          `CALL mock_schema.mock_procedure(\n` +
            `  'mock_function_name',\n` +
            `  '{"mock_param_one": "Redd\\'s", "mock_param_two": "Corona"}'\n` +
            `);`,
        );
        expect(calledParams).toEqual({});
      });

      it("should preserve double-quote escapes through the Databricks SQL string layer", async () => {
        const procedureConfig = createDeltalakeProcedureFetchDataConfig({
          functionName: "7_value_creation_commercial-results_waterfall",
          parameters: ["channel"],
        });

        await repository.fetchData(procedureConfig, [
          {
            name: "channel",
            value: '3rd Party (Distributors, Wholesalers, "Socios")',
          },
        ]);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(parseProcedureJsonAfterSqlProcessing(calledQuery)).toMatchObject(
          {
            channel: '3rd Party (Distributors, Wholesalers, "Socios")',
            environment: "PRD",
          },
        );
        expect(calledParams).toEqual({});
      });

      it("should escape apostrophes and double quotes together without changing the value", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: mockProcedureTemplate,
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, [
          {
            name: "mock_param_one",
            value: String.raw`Redd's and "Socios"`,
          },
          { name: "mock_param_two", value: "plain" },
        ]);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(parseProcedureJsonAfterSqlProcessing(calledQuery)).toMatchObject(
          {
            mock_param_one: `Redd's and "Socios"`,
            mock_param_two: "plain",
          },
        );
        expect(calledParams).toEqual({});
      });

      it("should preserve literal backslashes in inlined values", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: mockProcedureTemplate,
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, [
          { name: "mock_param_one", value: String.raw`AB\InBev` },
          { name: "mock_param_two", value: "Corona\\" },
        ]);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toBe(
          `CALL mock_schema.mock_procedure(\n` +
            `  'mock_function_name',\n` +
            `  '{"mock_param_one": "AB\\\\\\\\InBev", "mock_param_two": "Corona\\\\\\\\"}'\n` +
            `);`,
        );
        expect(parseProcedureJsonAfterSqlProcessing(calledQuery)).toMatchObject(
          {
            mock_param_one: String.raw`AB\InBev`,
            mock_param_two: "Corona\\",
          },
        );
        expect(calledParams).toEqual({});
      });

      it("should preserve apostrophes and backslashes together through both parsers", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: mockProcedureTemplate,
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, [
          {
            name: "mock_param_one",
            value: String.raw`Redd's \ Path`,
          },
          { name: "mock_param_two", value: "plain" },
        ]);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        const expectedQuery = [
          "CALL mock_schema.mock_procedure(",
          "  'mock_function_name',",
          String.raw`  '{"mock_param_one": "Redd\'s \\\\ Path", "mock_param_two": "plain"}'`,
          ");",
        ].join("\n");

        expect(calledQuery).toBe(expectedQuery);
        expect(parseProcedureJsonAfterSqlProcessing(calledQuery)).toMatchObject(
          {
            mock_param_one: String.raw`Redd's \ Path`,
            mock_param_two: "plain",
          },
        );
        expect(calledParams).toEqual({});
      });

      it("should SQL-escape apostrophes for commercial-results filter procedure configs", async () => {
        const procedureConfig = createDeltalakeProcedureFetchDataConfig({
          functionName: "7_value_creation_commercial-results_filter",
          parameters: ["country", "zone", "brand"],
        });

        await repository.fetchData(procedureConfig, [
          { name: "country", value: "ZAF" },
          { name: "zone", value: "AFR" },
          { name: "brand", value: "Redd's" },
        ]);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toBe(
          `CALL gold_common.owr_result_query_sp(\n` +
            `          '7_value_creation_commercial-results_filter',\n` +
            `          '{"country": "ZAF", "zone": "AFR", "brand": "Redd\\'s", "environment": "PRD"}'\n` +
            `        );`,
        );
        expect(calledParams).toEqual({});
      });

      it("should not forward filters that are not parameters of a procedure dataset", async () => {
        const procedureConfig = {
          ...createDeltalakeProcedureFetchDataConfig({
            functionName: "7_value_creation_commercial-results_filter",
            parameters: ["country", "zone"],
            staticParams: { brand: "All" },
          }),
          parameters: ["country", "zone"],
        };

        await repository.fetchData(procedureConfig, [
          { name: "country", value: "COL" },
          { name: "zone", value: "MAZ" },
          {
            name: "channel",
            value: '3rd Party (Distributors, Wholesalers, "Socios")',
          },
          { name: "category", value: "Beer" },
        ]);

        const [calledQuery, calledParams] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toContain('"country": "COL"');
        expect(calledQuery).toContain('"zone": "MAZ"');
        expect(calledQuery).toContain('"brand": "All"');
        expect(calledParams).toEqual({});
      });

      it("should double-escape JSON quote escapes so they survive the SQL string layer", async () => {
        const procedureConfig: DeltalakeFetchDataConfig = {
          type: RepositoryType.deltalake,
          procedure: mockProcedureTemplate,
          executionType: DeltalakeExecutionType.procedure,
        };

        await repository.fetchData(procedureConfig, [
          { name: "mock_param_one", value: 'Say "hello"' },
          { name: "mock_param_two", value: "plain" },
        ]);

        const [calledQuery] = mockExecuteQuery.mock.calls[0];

        expect(calledQuery).toBe(
          `CALL mock_schema.mock_procedure(\n` +
            `  'mock_function_name',\n` +
            `  '{"mock_param_one": "Say \\\\"hello\\\\"", "mock_param_two": "plain"}'\n` +
            `);`,
        );
      });
    });
  });
});
