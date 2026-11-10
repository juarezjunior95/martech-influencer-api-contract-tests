import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { DatabricksClient } from "@infrastructure/services/databricks.client";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import { DBSQLParameter } from "@databricks/sql";

// Mock functions that will be shared across tests
const mockFetchAll = jest.fn();
const mockCloseOperation = jest.fn();
const mockExecuteStatement = jest.fn();
const mockCloseSession = jest.fn();
const mockOpenSession = jest.fn();
const mockCloseConnection = jest.fn();
const mockConnect = jest.fn();

// Provide a lightweight mock for the Databricks SDK to avoid loading
// native dependencies (lz4/xxhash) during tests.
jest.mock("@databricks/sql", () => {
  class MockDBSQLParameter {
    value: unknown;

    constructor(options: { value: unknown }) {
      this.value = options.value;
    }
  }

  return {
    DBSQLParameter: MockDBSQLParameter,
    DBSQLClient: jest.fn().mockImplementation(() => ({
      connect: mockConnect,
    })),
  };
});

describe("DatabricksClient", () => {
  let client: DatabricksClient;
  let mockEnvironmentConfigService: EnvironmentConfigService;

  const mockDatabricksConfig = {
    host: "test.databricks.com",
    path: "/sql/1.0/warehouses/test",
    catalog: "test_catalog",
    schema: "test_schema",
    azureTenantId: "test-tenant-id",
    oauthClientId: "test-client-id",
    oauthClientSecret: faker.string.alphanumeric(20),
    sessionConfig: {
      configuration: {
        query_tags: "environment:test,app:test-app",
      },
    },
  };

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock query operation
    const mockQueryOperation = {
      fetchAll: mockFetchAll,
      close: mockCloseOperation,
    };
    mockFetchAll.mockResolvedValue([{ id: 1, name: "Test" }]);
    mockCloseOperation.mockResolvedValue(undefined);

    // Setup mock session
    const mockSession = {
      executeStatement: mockExecuteStatement,
      close: mockCloseSession,
    };
    mockExecuteStatement.mockResolvedValue(mockQueryOperation);
    mockCloseSession.mockResolvedValue(undefined);

    // Setup mock connection
    const mockConnection = {
      openSession: mockOpenSession,
      close: mockCloseConnection,
    };
    mockOpenSession.mockResolvedValue(mockSession);
    mockCloseConnection.mockResolvedValue(undefined);

    // Setup DBSQLClient mock
    mockConnect.mockResolvedValue(mockConnection);

    // Mock EnvironmentConfigService
    mockEnvironmentConfigService = {
      databricks: mockDatabricksConfig,
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabricksClient,
        {
          provide: EnvironmentConfigService,
          useValue: mockEnvironmentConfigService,
        },
      ],
    }).compile();

    client = module.get<DatabricksClient>(DatabricksClient);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await client.closeConnection();
  });

  describe("constructor", () => {
    it("should initialize with valid configuration", () => {
      expect(client).toBeDefined();
    });

    it("should throw error when host is missing", () => {
      const invalidConfigService = {
        databricks: {
          ...mockDatabricksConfig,
          host: "",
        },
      } as any;

      expect(() => {
        new DatabricksClient(invalidConfigService);
      }).toThrow("DATABRICKS_SERVER_HOSTNAME environment variable is required");
    });

    it("should throw error when path is missing", () => {
      const invalidConfigService = {
        databricks: {
          ...mockDatabricksConfig,
          path: "",
        },
      } as any;

      expect(() => {
        new DatabricksClient(invalidConfigService);
      }).toThrow("DATABRICKS_HTTP_PATH environment variable is required");
    });

    it("should throw error when catalog is missing", () => {
      const invalidConfigService = {
        databricks: {
          ...mockDatabricksConfig,
          catalog: "",
        },
      } as any;

      expect(() => {
        new DatabricksClient(invalidConfigService);
      }).toThrow("DATABRICKS_CATALOG environment variable is required");
    });

    it("should throw error when schema is missing", () => {
      const invalidConfigService = {
        databricks: {
          ...mockDatabricksConfig,
          schema: "",
        },
      } as any;

      expect(() => {
        new DatabricksClient(invalidConfigService);
      }).toThrow("DATABRICKS_SCHEMA environment variable is required");
    });

    it("should throw error when azureTenantId is missing", () => {
      const invalidConfigService = {
        databricks: {
          ...mockDatabricksConfig,
          azureTenantId: "",
        },
      } as any;

      expect(() => {
        new DatabricksClient(invalidConfigService);
      }).toThrow("DATABRICKS_AZURE_TENANT_ID environment variable is required");
    });

    it("should throw error when oauthClientId is missing", () => {
      const invalidConfigService = {
        databricks: {
          ...mockDatabricksConfig,
          oauthClientId: "",
        },
      } as any;

      expect(() => {
        new DatabricksClient(invalidConfigService);
      }).toThrow("DATABRICKS_OAUTH_CLIENT_ID environment variable is required");
    });

    it("should throw error when oauthClientSecret is missing", () => {
      const invalidConfigService = {
        databricks: {
          ...mockDatabricksConfig,
          oauthClientSecret: "",
        },
      } as any;

      expect(() => {
        new DatabricksClient(invalidConfigService);
      }).toThrow(
        "DATABRICKS_OAUTH_CLIENT_SECRET environment variable is required",
      );
    });
  });

  describe("executeQuery", () => {
    const testQuery = "SELECT * FROM test_table";

    it("should execute query successfully", async () => {
      const result = await client.executeQuery(testQuery);

      expect(result).toEqual([{ id: 1, name: "Test" }]);
      expect(mockConnect).toHaveBeenCalledWith({
        authType: "databricks-oauth",
        host: mockDatabricksConfig.host,
        path: mockDatabricksConfig.path,
        azureTenantId: mockDatabricksConfig.azureTenantId,
        useDatabricksOAuthInAzure: true,
        oauthClientId: mockDatabricksConfig.oauthClientId,
        oauthClientSecret: mockDatabricksConfig.oauthClientSecret,
      });
      expect(mockOpenSession).toHaveBeenCalledWith({
        initialCatalog: mockDatabricksConfig.catalog,
        initialSchema: mockDatabricksConfig.schema,
        configuration: {
          query_tags: "environment:test,app:test-app",
        },
      });
      expect(mockExecuteStatement).toHaveBeenCalledWith(testQuery, {
        runAsync: false,
      });
      expect(mockFetchAll).toHaveBeenCalled();
      expect(mockCloseOperation).toHaveBeenCalled();
    });

    it("should execute query with named parameters", async () => {
      const namedParameters = {
        country: new DBSQLParameter({ value: "BR" }),
        year: new DBSQLParameter({ value: 2024 }),
      };

      const result = await client.executeQuery(testQuery, namedParameters);

      expect(result).toEqual([{ id: 1, name: "Test" }]);
      expect(mockExecuteStatement).toHaveBeenCalledWith(testQuery, {
        runAsync: false,
        namedParameters,
      });
    });

    it("should reuse existing session for subsequent queries", async () => {
      await client.executeQuery(testQuery);
      await client.executeQuery(testQuery);
      await client.executeQuery(testQuery);

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockOpenSession).toHaveBeenCalledTimes(1);
      expect(mockExecuteStatement).toHaveBeenCalledTimes(3);
    });

    it("should retry query with new session when query fails", async () => {
      // First query execution fails
      mockExecuteStatement
        .mockRejectedValueOnce(new Error("Query execution failed"))
        .mockResolvedValueOnce({
          fetchAll: mockFetchAll,
          close: mockCloseOperation,
        });

      const result = await client.executeQuery(testQuery);

      expect(result).toEqual([{ id: 1, name: "Test" }]);
      expect(mockConnect).toHaveBeenCalledTimes(2);
      expect(mockOpenSession).toHaveBeenCalledTimes(2);
      expect(mockExecuteStatement).toHaveBeenCalledTimes(2);
    });

    it("should throw error when query fails after retry", async () => {
      mockExecuteStatement.mockRejectedValue(
        new Error("Persistent query failure"),
      );

      await expect(client.executeQuery(testQuery)).rejects.toThrow(
        "Persistent query failure",
      );
    });

    it("should handle empty query results", async () => {
      mockFetchAll.mockResolvedValue([]);

      const result = await client.executeQuery(testQuery);

      expect(result).toEqual([]);
    });

    it("should handle large result sets", async () => {
      const largeResult = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: `test-${i}`,
      }));
      mockFetchAll.mockResolvedValue(largeResult);

      const result = await client.executeQuery(testQuery);

      expect(result).toHaveLength(10000);
      expect(result).toEqual(largeResult);
    });

    it("should close query operation after fetchAll", async () => {
      await client.executeQuery(testQuery);

      expect(mockCloseOperation).toHaveBeenCalled();
    });

    it("should execute complex queries with multiple parameters", async () => {
      const complexQuery = `
        SELECT * FROM test_table 
        WHERE country = :country 
        AND year = :year 
        AND status = :status
      `;
      const parameters = {
        country: new DBSQLParameter({ value: "BR" }),
        year: new DBSQLParameter({ value: 2024 }),
        status: new DBSQLParameter({ value: "active" }),
      };

      const result = await client.executeQuery(complexQuery, parameters);

      expect(result).toEqual([{ id: 1, name: "Test" }]);
      expect(mockExecuteStatement).toHaveBeenCalledWith(complexQuery, {
        runAsync: false,
        namedParameters: parameters,
      });
    });
  });

  describe("closeConnection", () => {
    it("should close session and connection", async () => {
      await client.executeQuery("SELECT 1");
      await client.closeConnection();

      expect(mockCloseSession).toHaveBeenCalled();
      expect(mockCloseConnection).toHaveBeenCalled();
    });

    it("should handle closing when no session exists", async () => {
      await client.closeConnection();

      expect(mockCloseSession).not.toHaveBeenCalled();
      expect(mockCloseConnection).not.toHaveBeenCalled();
    });

    it("should handle errors during session close", async () => {
      await client.executeQuery("SELECT 1");
      mockCloseSession.mockRejectedValue(new Error("Session close error"));

      await expect(client.closeConnection()).resolves.not.toThrow();
    });

    it("should handle errors during connection close", async () => {
      await client.executeQuery("SELECT 1");
      mockCloseConnection.mockRejectedValue(
        new Error("Connection close error"),
      );

      await expect(client.closeConnection()).resolves.not.toThrow();
    });

    it("should reset session and connection to null after closing", async () => {
      await client.executeQuery("SELECT 1");
      await client.closeConnection();

      // Reset mocks to track new connection
      jest.clearAllMocks();

      // Next query should create new connection
      await client.executeQuery("SELECT 1");

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockOpenSession).toHaveBeenCalledTimes(1);
    });

    it("should wait for ongoing session creation before closing", async () => {
      const queryPromise = client.executeQuery("SELECT 1");
      const closePromise = client.closeConnection();

      await Promise.all([queryPromise, closePromise]);

      expect(mockCloseSession).toHaveBeenCalled();
      expect(mockCloseConnection).toHaveBeenCalled();
    });
  });

  describe("session management", () => {
    it("should create only one session for concurrent requests", async () => {
      const queries = [
        client.executeQuery("SELECT 1"),
        client.executeQuery("SELECT 2"),
        client.executeQuery("SELECT 3"),
      ];

      await Promise.all(queries);

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockOpenSession).toHaveBeenCalledTimes(1);
    });

    it("should handle session creation failure", async () => {
      mockOpenSession.mockRejectedValue(new Error("Session creation failed"));

      await expect(client.executeQuery("SELECT 1")).rejects.toThrow(
        "Session creation failed",
      );
    });

    it("should retry session creation after failure", async () => {
      mockOpenSession
        .mockRejectedValueOnce(new Error("Session creation failed"))
        .mockResolvedValueOnce({
          executeStatement: mockExecuteStatement,
          close: mockCloseSession,
        });

      await expect(client.executeQuery("SELECT 1")).rejects.toThrow(
        "Session creation failed",
      );

      const result = await client.executeQuery("SELECT 1");

      expect(result).toEqual([{ id: 1, name: "Test" }]);
      expect(mockConnect).toHaveBeenCalledTimes(2);
    });

    it("should handle connection failure", async () => {
      mockConnect.mockRejectedValue(new Error("Connection failed"));

      await expect(client.executeQuery("SELECT 1")).rejects.toThrow(
        "Connection failed",
      );
    });

    it("should create new session after query failure", async () => {
      // First query succeeds
      await client.executeQuery("SELECT 1");

      // Setup mocks for second connection
      const newMockQueryOperation = {
        fetchAll: jest.fn().mockResolvedValue([{ id: 2, name: "Test 2" }]),
        close: jest.fn().mockResolvedValue(undefined),
      };

      const newMockSession = {
        executeStatement: jest.fn().mockResolvedValue(newMockQueryOperation),
        close: jest.fn().mockResolvedValue(undefined),
      };

      const newMockConnection = {
        openSession: jest.fn().mockResolvedValue(newMockSession),
        close: jest.fn().mockResolvedValue(undefined),
      };

      // First executeStatement call fails (triggering retry)
      mockExecuteStatement.mockRejectedValueOnce(new Error("Session expired"));
      mockConnect.mockResolvedValueOnce(newMockConnection);

      // Execute query that will fail and retry
      await client.executeQuery("SELECT 2");

      // Verify new connection was created for retry
      expect(mockConnect).toHaveBeenCalledTimes(2); // Once for initial, once for retry
      expect(newMockConnection.openSession).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should propagate connection errors", async () => {
      mockConnect.mockRejectedValue(new Error("Network unreachable"));

      await expect(client.executeQuery("SELECT 1")).rejects.toThrow(
        "Network unreachable",
      );
    });

    it("should propagate session creation errors", async () => {
      mockOpenSession.mockRejectedValue(new Error("Authentication failed"));

      await expect(client.executeQuery("SELECT 1")).rejects.toThrow(
        "Authentication failed",
      );
    });

    it("should propagate query execution errors", async () => {
      mockExecuteStatement.mockRejectedValue(
        new Error("Syntax error in query"),
      );

      await expect(client.executeQuery("SELECT * FORM table")).rejects.toThrow(
        "Syntax error in query",
      );
    });

    it("should propagate fetchAll errors", async () => {
      mockFetchAll.mockRejectedValue(new Error("Result fetch timeout"));

      await expect(client.executeQuery("SELECT 1")).rejects.toThrow(
        "Result fetch timeout",
      );
    });

    it("should handle query operation close errors gracefully", async () => {
      mockCloseOperation.mockRejectedValue(new Error("Close operation failed"));

      await expect(client.executeQuery("SELECT 1")).rejects.toThrow(
        "Close operation failed",
      );
    });
  });

  describe("integration scenarios", () => {
    it("should handle multiple sequential queries", async () => {
      const queries = ["SELECT 1", "SELECT 2", "SELECT 3"];

      for (const query of queries) {
        const result = await client.executeQuery(query);
        expect(result).toEqual([{ id: 1, name: "Test" }]);
      }

      expect(mockExecuteStatement).toHaveBeenCalledTimes(3);
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it("should handle queries with different parameter types", async () => {
      const parameterTypes = [
        { string: new DBSQLParameter({ value: "test" }) },
        { number: new DBSQLParameter({ value: 123 }) },
        { boolean: new DBSQLParameter({ value: true }) },
        { date: new DBSQLParameter({ value: new Date() }) },
      ];

      for (const params of parameterTypes) {
        await client.executeQuery("SELECT * FROM table WHERE x = :value", {
          value: params[Object.keys(params)[0]],
        });
      }

      expect(mockExecuteStatement).toHaveBeenCalledTimes(4);
    });

    it("should recover from transient failures", async () => {
      // Simulate transient failure
      mockExecuteStatement
        .mockRejectedValueOnce(new Error("Transient failure"))
        .mockResolvedValue({
          fetchAll: mockFetchAll,
          close: mockCloseOperation,
        });

      const result = await client.executeQuery("SELECT 1");

      expect(result).toEqual([{ id: 1, name: "Test" }]);
    });

    it("should maintain session across multiple successful queries after recovery", async () => {
      // First query fails and recovers
      mockExecuteStatement
        .mockRejectedValueOnce(new Error("Transient failure"))
        .mockResolvedValue({
          fetchAll: mockFetchAll,
          close: mockCloseOperation,
        });

      await client.executeQuery("SELECT 1");

      // Subsequent queries should use the same session
      await client.executeQuery("SELECT 2");
      await client.executeQuery("SELECT 3");

      expect(mockConnect).toHaveBeenCalledTimes(2); // Original + recovery
    });
  });

  describe("connection configuration", () => {
    it("should use correct OAuth configuration", async () => {
      await client.executeQuery("SELECT 1");

      expect(mockConnect).toHaveBeenCalledWith(
        expect.objectContaining({
          authType: "databricks-oauth",
          useDatabricksOAuthInAzure: true,
          oauthClientId: mockDatabricksConfig.oauthClientId,
          oauthClientSecret: mockDatabricksConfig.oauthClientSecret,
          azureTenantId: mockDatabricksConfig.azureTenantId,
        }),
      );
    });

    it("should use correct host and path configuration", async () => {
      await client.executeQuery("SELECT 1");

      expect(mockConnect).toHaveBeenCalledWith(
        expect.objectContaining({
          host: mockDatabricksConfig.host,
          path: mockDatabricksConfig.path,
        }),
      );
    });

    it("should use correct catalog and schema configuration", async () => {
      await client.executeQuery("SELECT 1");

      expect(mockOpenSession).toHaveBeenCalledWith(
        expect.objectContaining({
          initialCatalog: mockDatabricksConfig.catalog,
          initialSchema: mockDatabricksConfig.schema,
        }),
      );
    });

    it("should include session configuration with query tags", async () => {
      await client.executeQuery("SELECT 1");

      expect(mockOpenSession).toHaveBeenCalledWith(
        expect.objectContaining({
          configuration: {
            query_tags: "environment:test,app:test-app",
          },
        }),
      );
    });
  });
});
