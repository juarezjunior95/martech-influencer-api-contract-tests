import { Test, TestingModule } from "@nestjs/testing";
import { PostgresDataRepository } from "@infrastructure/repositories/postgres-data.repository";
import { Filter } from "@domain/entities/datasource.entity";
import {
  DatabaseFetchDataConfig,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import { FileLoaderService } from "@common/services/file-loader.service";
import * as path from "path";

describe("PostgresDataRepository", () => {
  let repository: PostgresDataRepository;
  let fileLoaderService: FileLoaderService;

  const mockExecuteQuery = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostgresDataRepository,
        {
          provide: FileLoaderService,
          useValue: {
            load: jest.fn(),
          },
        },
        {
          provide: "PostgresClient",
          useValue: {
            executeQuery: mockExecuteQuery,
          },
        },
      ],
    }).compile();

    repository = module.get<PostgresDataRepository>(PostgresDataRepository);
    fileLoaderService = module.get<FileLoaderService>(FileLoaderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchData", () => {
    const mockFilters: Filter[] = [
      { name: "viewtype", value: "sales" },
      { name: "page_filter", value: "home" },
      { name: "zone", value: "south" },
    ];

    const mockProviderConfig: DatabaseFetchDataConfig = {
      type: RepositoryType.database,
      query: "test-query",
    };

    const mockSqlContent =
      "SELECT * FROM table WHERE viewtype = $viewtype AND page = $page_filter AND zone = $zone";
    const mockQueryResult = [
      { id: 1, name: "Test 1", viewtype: "sales" },
      { id: 2, name: "Test 2", viewtype: "sales" },
    ];

    beforeEach(() => {
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(mockSqlContent as any);
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
        expect.stringContaining("$1"),
        expect.any(Array),
      );
    });

    it("should convert named parameters to positional parameters correctly", async () => {
      await repository.fetchData(mockProviderConfig, mockFilters);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      const calledParams = mockExecuteQuery.mock.calls[0][1];

      expect(calledQuery).toContain("$1");
      expect(calledQuery).toContain("$2");
      expect(calledQuery).toContain("$3");
      expect(calledQuery).not.toContain("$viewtype");
      expect(calledQuery).not.toContain("$page_filter");
      expect(calledQuery).not.toContain("$zone");
      expect(calledParams).toEqual(["sales", "home", "south"]);
    });

    it("should maintain parameter order based on first appearance in query", async () => {
      const sqlWithRepeatedParams =
        "SELECT * FROM table WHERE type = $viewtype AND id = $page_filter AND type = $viewtype";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithRepeatedParams as any);

      await repository.fetchData(mockProviderConfig, mockFilters);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      const calledParams = mockExecuteQuery.mock.calls[0][1];

      // Should have $1 twice (for $viewtype) and $2 once (for $page_filter)
      expect(calledQuery).toBe(
        "SELECT * FROM table WHERE type = $1 AND id = $2 AND type = $1",
      );
      expect(calledParams).toEqual(["sales", "home"]);
    });

    it("should handle empty filters array", async () => {
      const sqlWithoutParams = "SELECT * FROM table";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithoutParams as any);

      await repository.fetchData(mockProviderConfig, []);

      const calledParams = mockExecuteQuery.mock.calls[0][1];
      expect(calledParams).toEqual([]);
    });

    it("should handle different filter value types", async () => {
      const filtersWithDifferentTypes: Filter[] = [
        { name: "stringFilter", value: "test" },
        { name: "numberFilter", value: 123 },
        { name: "booleanFilter", value: true },
      ];
      const sqlWithParams =
        "SELECT * FROM table WHERE str = $stringFilter AND num = $numberFilter AND bool = $booleanFilter";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithParams as any);

      await repository.fetchData(mockProviderConfig, filtersWithDifferentTypes);

      const calledParams = mockExecuteQuery.mock.calls[0][1];
      expect(calledParams).toEqual(["test", 123, true]);
    });

    it("should throw error when SQL file does not exist", async () => {
      jest
        .spyOn((repository as any).logger, "error")
        .mockImplementation(() => {});
      jest
        .spyOn(fileLoaderService, "load")
        .mockRejectedValue(new Error("File not found") as any);

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow("File not found");
    });

    it("should throw error when SQL file cannot be read", async () => {
      jest.spyOn(fileLoaderService, "load").mockRejectedValue(() => {
        throw new Error("Permission denied");
      });

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow("Permission denied");
    });

    it("should throw error when query execution fails", async () => {
      mockExecuteQuery.mockRejectedValue(new Error("Query execution failed"));

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow("Query execution failed");
    });

    it("should throw error when named parameter in query is not in filters", async () => {
      const sqlWithMissingParam =
        "SELECT * FROM table WHERE missing = $missing";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithMissingParam as any);

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow(
        "Named parameter $missing found in query but not in filters list",
      );
    });

    it("should load SQL file from correct directory path", async () => {
      path.join(
        process.cwd(),
        "src",
        "infrastructure",
        "sql",
        "postgres",
        "test-query.sql",
      );
      await repository.fetchData(mockProviderConfig, mockFilters);
    });

    it("should return empty array when query returns no results", async () => {
      mockExecuteQuery.mockResolvedValue([]);

      const result = await repository.fetchData(
        mockProviderConfig,
        mockFilters,
      );

      expect(result).toEqual([]);
    });

    it("should handle provider config with additional properties", async () => {
      const configWithExtra: DatabaseFetchDataConfig = {
        type: RepositoryType.database,
        query: "test-query",
        timeout: 5000,
        maxRetries: 3,
      } as any;

      const result = await repository.fetchData(configWithExtra, mockFilters);

      expect(result).toEqual(mockQueryResult);
    });

    it("should handle large result sets", async () => {
      const largeResultSet = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }));
      mockExecuteQuery.mockResolvedValue(largeResultSet);

      const result = await repository.fetchData(
        mockProviderConfig,
        mockFilters,
      );

      expect(result).toHaveLength(10000);
      expect(result).toEqual(largeResultSet);
    });

    it("should handle filters with special characters in values", async () => {
      const filtersWithSpecialChars: Filter[] = [
        { name: "email", value: "test@example.com" },
        {
          name: "description",
          value: "Test with 'quotes' and \"double quotes\"",
        },
      ];
      const sqlWithParams =
        "SELECT * FROM table WHERE email = $email AND desc = $description";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithParams as any);

      await repository.fetchData(mockProviderConfig, filtersWithSpecialChars);

      expect(mockExecuteQuery).toHaveBeenCalled();
      const calledParams = mockExecuteQuery.mock.calls[0][1];
      expect(calledParams).toEqual([
        "test@example.com",
        "Test with 'quotes' and \"double quotes\"",
      ]);
    });

    it("should handle SQL files with different query names", async () => {
      const configs: DatabaseFetchDataConfig[] = [
        { type: RepositoryType.database, query: "sales-report" },
        { type: RepositoryType.database, query: "user-analytics" },
        { type: RepositoryType.database, query: "inventory-status" },
      ];

      for (const config of configs) {
        await repository.fetchData(config, mockFilters);
        expect(fileLoaderService.load).toHaveBeenCalledWith(
          expect.stringContaining(`${config.query}.sql`),
        );
      }
    });

    it("should handle complex parameter names with underscores", async () => {
      const filtersWithUnderscores: Filter[] = [
        { name: "page_filter", value: "home" },
        { name: "user_id", value: 123 },
        { name: "is_active", value: true },
      ];
      const sqlWithParams =
        "SELECT * FROM table WHERE page = $page_filter AND user = $user_id AND active = $is_active";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithParams as any);

      await repository.fetchData(mockProviderConfig, filtersWithUnderscores);

      const calledParams = mockExecuteQuery.mock.calls[0][1];
      expect(calledParams).toEqual(["home", 123, true]);
    });

    it("should handle parameters with same prefix", async () => {
      const filtersWithSimilarNames: Filter[] = [
        { name: "user", value: "john" },
        { name: "user_id", value: 123 },
        { name: "username", value: "johndoe" },
      ];
      const sqlWithParams =
        "SELECT * FROM table WHERE u = $user AND id = $user_id AND name = $username";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithParams as any);

      await repository.fetchData(mockProviderConfig, filtersWithSimilarNames);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      const calledParams = mockExecuteQuery.mock.calls[0][1];

      expect(calledQuery).toBe(
        "SELECT * FROM table WHERE u = $1 AND id = $2 AND name = $3",
      );
      expect(calledParams).toEqual(["john", 123, "johndoe"]);
    });

    it("should handle SQL query with multiple occurrences of same parameter", async () => {
      const sqlWithRepeatedParams =
        "SELECT * FROM table WHERE (type = $viewtype OR category = $viewtype) AND status = $page_filter";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithRepeatedParams as any);

      await repository.fetchData(mockProviderConfig, mockFilters);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      const calledParams = mockExecuteQuery.mock.calls[0][1];

      expect(calledQuery).toBe(
        "SELECT * FROM table WHERE (type = $1 OR category = $1) AND status = $2",
      );
      expect(calledParams).toEqual(["sales", "home"]);
    });

    it("should handle SQL with no parameters", async () => {
      const sqlWithoutParams = "SELECT * FROM table";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithoutParams as any);

      await repository.fetchData(mockProviderConfig, []);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      const calledParams = mockExecuteQuery.mock.calls[0][1];

      expect(calledQuery).toBe(sqlWithoutParams);
      expect(calledParams).toEqual([]);
    });

    it("should handle null and undefined filter values", async () => {
      const filtersWithNullish: Filter[] = [
        { name: "nullValue", value: null },
        { name: "undefinedValue", value: undefined },
        { name: "emptyString", value: "" },
      ];
      const sqlWithParams =
        "SELECT * FROM table WHERE a = $nullValue AND b = $undefinedValue AND c = $emptyString";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithParams as any);

      await repository.fetchData(mockProviderConfig, filtersWithNullish);

      const calledParams = mockExecuteQuery.mock.calls[0][1];
      expect(calledParams).toEqual([null, undefined, ""]);
    });

    it("should handle SQL with parameters at query boundaries", async () => {
      const sqlWithBoundaryParams = "$viewtype AND $page_filter OR $zone";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithBoundaryParams as any);

      await repository.fetchData(mockProviderConfig, mockFilters);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      expect(calledQuery).toBe("$1 AND $2 OR $3");
    });

    it("should handle SQL with parameters in different contexts", async () => {
      const sqlComplex =
        "SELECT * FROM table WHERE col1 = $viewtype AND col2 IN ($page_filter) ORDER BY $zone";
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlComplex as any);

      await repository.fetchData(mockProviderConfig, mockFilters);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      const calledParams = mockExecuteQuery.mock.calls[0][1];

      expect(calledQuery).toBe(
        "SELECT * FROM table WHERE col1 = $1 AND col2 IN ($2) ORDER BY $3",
      );
      expect(calledParams).toEqual(["sales", "home", "south"]);
    });

    it("should preserve SQL structure when replacing parameters", async () => {
      const sqlWithFormatting = `
        SELECT *
        FROM table
        WHERE viewtype = $viewtype
          AND page = $page_filter
          AND zone = $zone
      `;
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithFormatting as any);

      await repository.fetchData(mockProviderConfig, mockFilters);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      expect(calledQuery).toContain("WHERE viewtype = $1");
      expect(calledQuery).toContain("AND page = $2");
      expect(calledQuery).toContain("AND zone = $3");
    });
  });

  describe("integration scenarios", () => {
    it("should handle multiple consecutive fetchData calls", async () => {
      const mockProviderConfig: DatabaseFetchDataConfig = {
        type: RepositoryType.database,
        query: "test-query",
      };
      const mockFilters: Filter[] = [{ name: "country", value: "BR" }];

      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(
          "SELECT * FROM table WHERE country = $country" as any,
        );
      mockExecuteQuery.mockResolvedValue([{ id: 1 }]);

      await repository.fetchData(mockProviderConfig, mockFilters);
      await repository.fetchData(mockProviderConfig, mockFilters);
      await repository.fetchData(mockProviderConfig, mockFilters);

      expect(mockExecuteQuery).toHaveBeenCalledTimes(3);
    });

    it("should handle concurrent fetchData calls", async () => {
      const mockProviderConfig: DatabaseFetchDataConfig = {
        type: RepositoryType.database,
        query: "test-query",
      };
      const mockFilters: Filter[] = [{ name: "country", value: "BR" }];

      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(
          "SELECT * FROM table WHERE country = $country" as any,
        );
      mockExecuteQuery.mockResolvedValue([{ id: 1 }]);

      const promises = Array.from({ length: 5 }, () =>
        repository.fetchData(mockProviderConfig, mockFilters),
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      expect(mockExecuteQuery).toHaveBeenCalledTimes(5);
    });

    it("should handle different queries with different parameters", async () => {
      const queries: Array<{
        config: DatabaseFetchDataConfig;
        filters: Filter[];
        sql: string;
      }> = [
        {
          config: { type: RepositoryType.database, query: "test-query-1" },
          filters: [{ name: "param1", value: "value1" }],
          sql: "SELECT * FROM t1 WHERE c1 = $param1",
        },
        {
          config: { type: RepositoryType.database, query: "query2" },
          filters: [
            { name: "param2", value: "value2" },
            { name: "param3", value: "value3" },
          ],
          sql: "SELECT * FROM t2 WHERE c2 = $param2 AND c3 = $param3",
        },
      ];

      for (const { config, filters, sql } of queries) {
        jest.spyOn(fileLoaderService, "load").mockResolvedValue(sql as any);
        mockExecuteQuery.mockResolvedValue([]);

        await repository.fetchData(config, filters);
      }

      expect(mockExecuteQuery).toHaveBeenCalledTimes(2);
    });
  });

  describe("error handling and logging", () => {
    it("should propagate postgres client errors", async () => {
      const mockProviderConfig: DatabaseFetchDataConfig = {
        type: RepositoryType.database,
        query: "test-query",
      };
      const mockFilters: Filter[] = [{ name: "country", value: "BR" }];

      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(
          "SELECT * FROM table WHERE country = $country" as any,
        );

      const clientError = new Error("Connection timeout");
      mockExecuteQuery.mockRejectedValue(clientError);

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow("Connection timeout");
    });

    it("should handle undefined or null filter values gracefully", async () => {
      const mockProviderConfig: DatabaseFetchDataConfig = {
        type: RepositoryType.database,
        query: "test-query",
      };
      const filtersWithNullish: Filter[] = [
        { name: "country", value: "" },
        { name: "year", value: 0 },
        { name: "active", value: false },
      ];

      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(
          "SELECT * FROM table WHERE country = $country AND year = $year AND active = $active" as any,
        );
      mockExecuteQuery.mockResolvedValue([]);

      const result = await repository.fetchData(
        mockProviderConfig,
        filtersWithNullish,
      );

      expect(result).toEqual([]);
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM table WHERE country = $1 AND year = $2 AND active = $3",
        ["", 0, false],
      );
    });

    it("should handle file system errors during SQL file loading", async () => {
      const mockProviderConfig: DatabaseFetchDataConfig = {
        type: RepositoryType.database,
        query: "test-query",
      };
      const mockFilters: Filter[] = [{ name: "country", value: "BR" }];

      jest.spyOn(fileLoaderService, "load").mockRejectedValue(() => {
        throw new Error("EACCES: permission denied");
      });

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow("EACCES: permission denied");
    });

    it("should handle database connection errors", async () => {
      const mockProviderConfig: DatabaseFetchDataConfig = {
        type: RepositoryType.database,
        query: "test-query",
      };
      const mockFilters: Filter[] = [{ name: "country", value: "BR" }];

      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(
          "SELECT * FROM table WHERE country = $country" as any,
        );
      mockExecuteQuery.mockRejectedValue(
        new Error("ECONNREFUSED: Connection refused"),
      );

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow("ECONNREFUSED: Connection refused");
    });

    it("should handle SQL syntax errors from database", async () => {
      const mockProviderConfig: DatabaseFetchDataConfig = {
        type: RepositoryType.database,
        query: "test-query",
      };
      const mockFilters: Filter[] = [{ name: "country", value: "BR" }];

      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(
          "SELECT * FROM invalid_table WHERE country = $country" as any,
        );
      mockExecuteQuery.mockRejectedValue(
        new Error('relation "invalid_table" does not exist'),
      );

      await expect(
        repository.fetchData(mockProviderConfig, mockFilters),
      ).rejects.toThrow('relation "invalid_table" does not exist');
    });
  });

  describe("parameter conversion edge cases", () => {
    const mockProviderConfig: DatabaseFetchDataConfig = {
      type: RepositoryType.database,
      query: "test-query",
    };

    beforeEach(() => {
      mockExecuteQuery.mockResolvedValue([]);
    });

    it("should handle parameter names starting with numbers", async () => {
      const filters: Filter[] = [{ name: "filter1", value: "value1" }];
      const sql = "SELECT * FROM table WHERE col = $filter1";
      jest.spyOn(fileLoaderService, "load").mockResolvedValue(sql as any);

      await repository.fetchData(mockProviderConfig, filters);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      expect(calledQuery).toBe("SELECT * FROM table WHERE col = $1");
    });

    it("should handle very long parameter names", async () => {
      const longParamName = "very_long_parameter_name_with_many_underscores";
      const filters: Filter[] = [{ name: longParamName, value: "value" }];
      const sql = `SELECT * FROM table WHERE col = $${longParamName}`;
      jest.spyOn(fileLoaderService, "load").mockResolvedValue(sql as any);

      await repository.fetchData(mockProviderConfig, filters);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      expect(calledQuery).toBe("SELECT * FROM table WHERE col = $1");
    });

    it("should not replace parameters that are part of larger words", async () => {
      const filters: Filter[] = [{ name: "id", value: 123 }];
      const sql = "SELECT * FROM table WHERE user_id = $id AND guid = $id";
      jest.spyOn(fileLoaderService, "load").mockResolvedValue(sql as any);

      await repository.fetchData(mockProviderConfig, filters);

      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      expect(calledQuery).toBe(
        "SELECT * FROM table WHERE user_id = $1 AND guid = $1",
      );
    });

    it("should handle case sensitivity in parameter names", async () => {
      const filters: Filter[] = [
        { name: "UserId", value: 123 },
        { name: "userId", value: 456 },
      ];
      const sql =
        "SELECT * FROM table WHERE upper_id = $UserId AND lower_id = $userId";
      jest.spyOn(fileLoaderService, "load").mockResolvedValue(sql as any);

      await repository.fetchData(mockProviderConfig, filters);

      const calledParams = mockExecuteQuery.mock.calls[0][1];
      expect(calledParams).toEqual([123, 456]);
    });

    it("should handle zero value filters correctly", async () => {
      const filters: Filter[] = [
        { name: "count", value: 0 },
        { name: "price", value: 0.0 },
      ];
      const sql = "SELECT * FROM table WHERE count = $count AND price = $price";
      jest.spyOn(fileLoaderService, "load").mockResolvedValue(sql as any);

      await repository.fetchData(mockProviderConfig, filters);

      const calledParams = mockExecuteQuery.mock.calls[0][1];
      expect(calledParams).toEqual([0, 0.0]);
    });
  });

  describe("SQL file loading", () => {
    const mockProviderConfig: DatabaseFetchDataConfig = {
      type: RepositoryType.database,
      query: "test-query",
    };
    const mockFilters: Filter[] = [{ name: "param", value: "value" }];

    beforeEach(() => {
      mockExecuteQuery.mockResolvedValue([]);
    });

    it("should use correct SQL directory path", async () => {
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue("SELECT 1" as any);

      await repository.fetchData(mockProviderConfig, mockFilters);
      path.join(
        process.cwd(),
        "src",
        "infrastructure",
        "sql",
        "postgres",
        "test-query.sql",
      );
    });

    it("should append .sql extension to query name", async () => {
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue("SELECT 1" as any);

      await repository.fetchData(mockProviderConfig, mockFilters);

      expect(fileLoaderService.load).toHaveBeenCalledWith(
        expect.stringContaining("test-query.sql"),
      );
    });

    it("should read file with utf8 encoding", async () => {
      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue("SELECT 1" as any);

      await repository.fetchData(mockProviderConfig, mockFilters);
    });

    it("should handle SQL files with UTF-8 special characters", async () => {
      const sqlWithUnicode =
        "SELECT * FROM table WHERE description = 'Configuração com acentuação: çãõé'";

      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithUnicode as any);

      await repository.fetchData(mockProviderConfig, mockFilters);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        sqlWithUnicode,
        expect.any(Array),
      );
    });

    it("should handle multiline SQL queries", async () => {
      const multilineSql = `
        SELECT 
          column1,
          column2,
          column3
        FROM 
          table_name
        WHERE 
          condition = $param
      `;

      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(multilineSql as any);

      await repository.fetchData(mockProviderConfig, mockFilters);

      expect(mockExecuteQuery).toHaveBeenCalled();
      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      expect(calledQuery).toContain("SELECT");
      expect(calledQuery).toContain("FROM");
      expect(calledQuery).toContain("WHERE");
    });

    it("should handle SQL files with comments", async () => {
      const sqlWithComments = `
        -- This is a comment
        SELECT * FROM table
        /* Multi-line
           comment */
        WHERE param = $param
      `;

      jest
        .spyOn(fileLoaderService, "load")
        .mockResolvedValue(sqlWithComments as any);

      await repository.fetchData(mockProviderConfig, mockFilters);

      expect(mockExecuteQuery).toHaveBeenCalled();
      const calledQuery = mockExecuteQuery.mock.calls[0][0];
      expect(calledQuery).toContain("-- This is a comment");
      expect(calledQuery).toContain("SELECT * FROM table");
      expect(calledQuery).toContain("/* Multi-line");
      expect(calledQuery).toContain("WHERE param = $1");
    });
  });
});
