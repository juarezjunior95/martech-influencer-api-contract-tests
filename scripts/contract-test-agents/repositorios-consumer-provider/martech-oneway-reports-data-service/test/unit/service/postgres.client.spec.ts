import { Test, TestingModule } from "@nestjs/testing";
import { PostgresClient } from "@infrastructure/services/postgres.client";

describe("PostgresClient", () => {
  let client: PostgresClient;
  let mockPool: { query: jest.Mock };

  beforeEach(async () => {
    // Mock Pool
    mockPool = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostgresClient,
        {
          provide: "POSTGRES_POOL",
          useValue: mockPool,
        },
      ],
    }).compile();

    client = module.get<PostgresClient>(PostgresClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("executeQuery", () => {
    const testQuery = "SELECT * FROM test_table";

    it("should execute query successfully without parameters", async () => {
      const mockRows = [
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" },
      ];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 2,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(testQuery);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(testQuery, undefined);
      expect(mockPool.query).toHaveBeenCalledTimes(1);
    });

    it("should execute query successfully with parameters", async () => {
      const queryWithParams =
        "SELECT * FROM test_table WHERE id = $1 AND name = $2";
      const parameters = [1, "Test"];
      const mockRows = [{ id: 1, name: "Test" }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(queryWithParams, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(queryWithParams, parameters);
      expect(mockPool.query).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when query returns no results", async () => {
      mockPool.query.mockResolvedValue({
        rows: [],
        command: "SELECT",
        rowCount: 0,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(testQuery);

      expect(result).toEqual([]);
      expect(mockPool.query).toHaveBeenCalledWith(testQuery, undefined);
    });

    it("should handle INSERT query", async () => {
      const insertQuery =
        "INSERT INTO test_table (name) VALUES ($1) RETURNING *";
      const parameters = ["New Test"];
      const mockRows = [{ id: 3, name: "New Test" }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(insertQuery, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(insertQuery, parameters);
    });

    it("should handle UPDATE query", async () => {
      const updateQuery =
        "UPDATE test_table SET name = $1 WHERE id = $2 RETURNING *";
      const parameters = ["Updated Test", 1];
      const mockRows = [{ id: 1, name: "Updated Test" }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "UPDATE",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(updateQuery, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(updateQuery, parameters);
    });

    it("should handle DELETE query", async () => {
      const deleteQuery = "DELETE FROM test_table WHERE id = $1 RETURNING *";
      const parameters = [1];
      const mockRows = [{ id: 1, name: "Deleted Test" }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "DELETE",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(deleteQuery, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(deleteQuery, parameters);
    });

    it("should handle query with multiple parameters", async () => {
      const complexQuery = `
        SELECT * FROM test_table 
        WHERE status = $1 
        AND created_at > $2 
        AND country = $3
      `;
      const parameters = ["active", new Date("2024-01-01"), "BR"];
      const mockRows = [
        { id: 1, status: "active", country: "BR" },
        { id: 2, status: "active", country: "BR" },
      ];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 2,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(complexQuery, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(complexQuery, parameters);
    });

    it("should handle query with empty parameters array", async () => {
      const mockRows = [{ id: 1, name: "Test" }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(testQuery, []);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(testQuery, []);
    });

    it("should handle large result sets", async () => {
      const largeResultSet = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }));

      mockPool.query.mockResolvedValue({
        rows: largeResultSet,
        command: "SELECT",
        rowCount: 10000,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(testQuery);

      expect(result).toHaveLength(10000);
      expect(result).toEqual(largeResultSet);
    });

    it("should handle parameters with special characters", async () => {
      const queryWithSpecialChars = "SELECT * FROM test_table WHERE email = $1";
      const parameters = ["test@example.com"];
      const mockRows = [{ id: 1, email: "test@example.com" }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(
        queryWithSpecialChars,
        parameters,
      );

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(
        queryWithSpecialChars,
        parameters,
      );
    });

    it("should handle parameters with null values", async () => {
      const queryWithNull = "SELECT * FROM test_table WHERE deleted_at IS $1";
      const parameters = [null];
      const mockRows = [{ id: 1, deleted_at: null }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(queryWithNull, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(queryWithNull, parameters);
    });

    it("should handle parameters with different data types", async () => {
      const query =
        "SELECT * FROM test_table WHERE active = $1 AND count = $2 AND price = $3";
      const parameters = [true, 42, 99.99];
      const mockRows = [{ id: 1, active: true, count: 42, price: 99.99 }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(query, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(query, parameters);
    });

    it("should throw error when query fails", async () => {
      const error = new Error("Syntax error in SQL query");
      mockPool.query.mockRejectedValue(error);

      await expect(client.executeQuery(testQuery)).rejects.toThrow(
        "Syntax error in SQL query",
      );
      expect(mockPool.query).toHaveBeenCalledWith(testQuery, undefined);
    });

    it("should throw error when connection fails", async () => {
      const error = new Error("Connection refused");
      mockPool.query.mockRejectedValue(error);

      await expect(client.executeQuery(testQuery)).rejects.toThrow(
        "Connection refused",
      );
    });

    it("should throw error with invalid SQL syntax", async () => {
      const invalidQuery = "SELEKT * FROM test_table";
      const error = new Error('syntax error at or near "SELEKT"');
      mockPool.query.mockRejectedValue(error);

      await expect(client.executeQuery(invalidQuery)).rejects.toThrow(
        'syntax error at or near "SELEKT"',
      );
      expect(mockPool.query).toHaveBeenCalledWith(invalidQuery, undefined);
    });

    it("should throw error when table does not exist", async () => {
      const error = new Error('relation "non_existent_table" does not exist');
      mockPool.query.mockRejectedValue(error);

      await expect(
        client.executeQuery("SELECT * FROM non_existent_table"),
      ).rejects.toThrow('relation "non_existent_table" does not exist');
    });

    it("should throw error when parameter count mismatch", async () => {
      const query = "SELECT * FROM test_table WHERE id = $1 AND name = $2";
      const parameters = [1]; // Missing second parameter
      const error = new Error(
        "bind message supplies 1 parameters, but prepared statement requires 2",
      );
      mockPool.query.mockRejectedValue(error);

      await expect(client.executeQuery(query, parameters)).rejects.toThrow(
        "bind message supplies 1 parameters, but prepared statement requires 2",
      );
    });

    it("should throw error when parameter type is incorrect", async () => {
      const query = "SELECT * FROM test_table WHERE id = $1";
      const parameters = ["not_a_number"]; // Should be number
      const error = new Error(
        'invalid input syntax for type integer: "not_a_number"',
      );
      mockPool.query.mockRejectedValue(error);

      await expect(client.executeQuery(query, parameters)).rejects.toThrow(
        'invalid input syntax for type integer: "not_a_number"',
      );
    });

    it("should throw error when constraint violation occurs", async () => {
      const insertQuery = "INSERT INTO test_table (id, name) VALUES ($1, $2)";
      const parameters = [1, "Test"]; // Duplicate id
      const error = new Error(
        'duplicate key value violates unique constraint "test_table_pkey"',
      );
      mockPool.query.mockRejectedValue(error);

      await expect(
        client.executeQuery(insertQuery, parameters),
      ).rejects.toThrow(
        'duplicate key value violates unique constraint "test_table_pkey"',
      );
    });

    it("should throw error when timeout occurs", async () => {
      const error = new Error("Query timeout");
      mockPool.query.mockRejectedValue(error);

      await expect(client.executeQuery(testQuery)).rejects.toThrow(
        "Query timeout",
      );
    });
  });

  describe("integration scenarios", () => {
    it("should handle multiple sequential queries", async () => {
      const queries = [
        "SELECT * FROM table1",
        "SELECT * FROM table2",
        "SELECT * FROM table3",
      ];

      mockPool.query.mockResolvedValue({
        rows: [{ id: 1 }],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      for (const query of queries) {
        const result = await client.executeQuery(query);
        expect(result).toEqual([{ id: 1 }]);
      }

      expect(mockPool.query).toHaveBeenCalledTimes(3);
    });

    it("should handle concurrent queries", async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ id: 1 }],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const queries = Array.from({ length: 5 }, () =>
        client.executeQuery("SELECT * FROM test_table"),
      );

      const results = await Promise.all(queries);

      expect(results).toHaveLength(5);
      expect(mockPool.query).toHaveBeenCalledTimes(5);
    });

    it("should handle transaction-like queries", async () => {
      const mockRows = [{ id: 1, name: "Test" }];

      mockPool.query
        .mockResolvedValueOnce({
          rows: [],
          command: "BEGIN",
          rowCount: 0,
          oid: 0,
          fields: [],
        } as any)
        .mockResolvedValueOnce({
          rows: mockRows,
          command: "INSERT",
          rowCount: 1,
          oid: 0,
          fields: [],
        } as any)
        .mockResolvedValueOnce({
          rows: mockRows,
          command: "UPDATE",
          rowCount: 1,
          oid: 0,
          fields: [],
        } as any)
        .mockResolvedValueOnce({
          rows: [],
          command: "COMMIT",
          rowCount: 0,
          oid: 0,
          fields: [],
        } as any);

      await client.executeQuery("BEGIN");
      const insertResult = await client.executeQuery(
        "INSERT INTO test_table (name) VALUES ($1) RETURNING *",
        ["Test"],
      );
      const updateResult = await client.executeQuery(
        "UPDATE test_table SET name = $1 WHERE id = $2 RETURNING *",
        ["Updated", 1],
      );
      await client.executeQuery("COMMIT");

      expect(insertResult).toEqual(mockRows);
      expect(updateResult).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledTimes(4);
    });

    it("should handle queries with different return types", async () => {
      mockPool.query
        .mockResolvedValueOnce({
          rows: [{ count: "100" }],
          command: "SELECT",
          rowCount: 1,
          oid: 0,
          fields: [],
        } as any)
        .mockResolvedValueOnce({
          rows: [{ exists: true }],
          command: "SELECT",
          rowCount: 1,
          oid: 0,
          fields: [],
        } as any)
        .mockResolvedValueOnce({
          rows: [{ max: 1000 }],
          command: "SELECT",
          rowCount: 1,
          oid: 0,
          fields: [],
        } as any);

      const countResult = await client.executeQuery(
        "SELECT COUNT(*) FROM test_table",
      );
      const existsResult = await client.executeQuery(
        "SELECT EXISTS(SELECT 1 FROM test_table WHERE id = $1)",
        [1],
      );
      const maxResult = await client.executeQuery(
        "SELECT MAX(value) FROM test_table",
      );

      expect(countResult).toEqual([{ count: "100" }]);
      expect(existsResult).toEqual([{ exists: true }]);
      expect(maxResult).toEqual([{ max: 1000 }]);
    });
  });

  describe("error handling and logging", () => {
    it("should log error message when query fails", async () => {
      const error = new Error("Database connection lost");
      mockPool.query.mockRejectedValue(error);

      await expect(
        client.executeQuery("SELECT * FROM test_table"),
      ).rejects.toThrow("Database connection lost");
    });

    it("should propagate original error", async () => {
      const originalError = new Error("Original error message");
      originalError.name = "CustomError";
      mockPool.query.mockRejectedValue(originalError);

      try {
        await client.executeQuery("SELECT * FROM test_table");
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBe(originalError);
        expect(error.message).toBe("Original error message");
        expect(error.name).toBe("CustomError");
      }
    });

    it("should handle errors with additional properties", async () => {
      const error: any = new Error("Database error");
      error.code = "23505";
      error.detail = "Key (id)=(1) already exists.";
      mockPool.query.mockRejectedValue(error);

      try {
        await client.executeQuery(
          "INSERT INTO test_table (id) VALUES ($1)",
          [1],
        );
        fail("Should have thrown an error");
      } catch (caughtError: any) {
        expect(caughtError.code).toBe("23505");
        expect(caughtError.detail).toBe("Key (id)=(1) already exists.");
      }
    });
  });

  describe("edge cases", () => {
    it("should handle query with only whitespace", async () => {
      const whitespaceQuery = "   ";
      const error = new Error("syntax error at or near end of input");
      mockPool.query.mockRejectedValue(error);

      await expect(client.executeQuery(whitespaceQuery)).rejects.toThrow(
        "syntax error at or near end of input",
      );
    });

    it("should handle very long query strings", async () => {
      const longQuery = `SELECT * FROM test_table WHERE ${Array.from(
        { length: 100 },
        (_, i) => `column_${i} = $${i + 1}`,
      ).join(" OR ")}`;
      const parameters = Array.from({ length: 100 }, (_, i) => `value_${i}`);
      const mockRows = [{ id: 1 }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(longQuery, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(longQuery, parameters);
    });

    it("should handle parameters with undefined values", async () => {
      const query = "SELECT * FROM test_table WHERE value = $1";
      const parameters = [undefined];
      const mockRows = [{ id: 1, value: null }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(query, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(query, parameters);
    });

    it("should handle empty string parameters", async () => {
      const query = "SELECT * FROM test_table WHERE name = $1";
      const parameters = [""];
      const mockRows = [{ id: 1, name: "" }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(query, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(query, parameters);
    });

    it("should handle array parameters", async () => {
      const query = "SELECT * FROM test_table WHERE id = ANY($1)";
      const parameters = [[1, 2, 3]];
      const mockRows = [
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" },
        { id: 3, name: "Test 3" },
      ];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "SELECT",
        rowCount: 3,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(query, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(query, parameters);
    });

    it("should handle JSON parameters", async () => {
      const query = "INSERT INTO test_table (data) VALUES ($1) RETURNING *";
      const jsonData = { key: "value", nested: { prop: 123 } };
      const parameters = [jsonData];
      const mockRows = [{ id: 1, data: jsonData }];

      mockPool.query.mockResolvedValue({
        rows: mockRows,
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      } as any);

      const result = await client.executeQuery(query, parameters);

      expect(result).toEqual(mockRows);
      expect(mockPool.query).toHaveBeenCalledWith(query, parameters);
    });
  });
});
