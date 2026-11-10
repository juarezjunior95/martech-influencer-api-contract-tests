import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { faker } from "@faker-js/faker";
import { EnvironmentConfigService } from "@common/config/environment-config.service";

describe("EnvironmentConfigService", () => {
  let service: EnvironmentConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EnvironmentConfigService>(EnvironmentConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("timeout", () => {
    it("should return default timeout value when not configured", () => {
      // Arrange
      jest
        .spyOn(configService, "get")
        .mockImplementation((key: string, defaultValue?: any) => defaultValue);

      // Act
      const result = service.timeout;

      // Assert
      expect(result).toBe(2000);
      expect(configService.get).toHaveBeenCalledWith("TIMEOUT", 2000);
    });

    it("should return configured timeout value", () => {
      // Arrange
      jest.spyOn(configService, "get").mockReturnValue(5000);

      // Act
      const result = service.timeout;

      // Assert
      expect(result).toBe(5000);
    });
  });

  describe("postgres", () => {
    it("should return postgres configuration with all properties", () => {
      // Arrange
      const password = faker.internet.password();
      const mockConfig = {
        POSTGRES_HOST: "localhost",
        POSTGRES_PORT: 5432,
        POSTGRES_USER: "testuser",
        POSTGRES_PASSWORD: password,
        POSTGRES_DATABASE: "testdb",
        POSTGRES_SSL: "true",
        TIMEOUT: 3000,
        POSTGRES_POOL_MIN: 5,
        POSTGRES_POOL_MAX: 30,
      };

      jest
        .spyOn(configService, "get")
        .mockImplementation((key: string, defaultValue?: any) => {
          return mockConfig[key] !== undefined ? mockConfig[key] : defaultValue;
        });

      // Act
      const result = service.postgres;

      // Assert
      expect(result).toEqual({
        host: "localhost",
        port: 5432,
        user: "testuser",
        password,
        database: "testdb",
        schema: "public",
        ssl: true,
        timeout: 3000,
        poolMin: 5,
        poolMax: 30,
      });
    });

    it("should return postgres configuration with ssl false", () => {
      // Arrange
      jest
        .spyOn(configService, "get")
        .mockImplementation((key: string, defaultValue?: any) => {
          if (key === "POSTGRES_SSL") return "false";
          if (key === "TIMEOUT") return 2000;
          if (key === "POSTGRES_POOL_MIN") return defaultValue;
          if (key === "POSTGRES_POOL_MAX") return defaultValue;
          return "value";
        });

      // Act
      const result = service.postgres;

      // Assert
      expect(result.ssl).toBe(false);
    });

    it("should return default pool values when not configured", () => {
      // Arrange
      jest
        .spyOn(configService, "get")
        .mockImplementation((key: string, defaultValue?: any) => {
          if (key === "POSTGRES_POOL_MIN") return defaultValue;
          if (key === "POSTGRES_POOL_MAX") return defaultValue;
          if (key === "TIMEOUT") return 2000;
          return "value";
        });

      // Act
      const result = service.postgres;

      // Assert
      expect(result.poolMin).toBe(0);
      expect(result.poolMax).toBe(20);
    });

    it("should handle ssl as non-string value", () => {
      // Arrange
      jest
        .spyOn(configService, "get")
        .mockImplementation((key: string, defaultValue?: any) => {
          if (key === "POSTGRES_SSL") return undefined;
          if (key === "TIMEOUT") return 2000;
          if (key === "POSTGRES_POOL_MIN") return defaultValue;
          if (key === "POSTGRES_POOL_MAX") return defaultValue;
          return "value";
        });

      // Act
      const result = service.postgres;

      // Assert
      expect(result.ssl).toBe(false);
    });
  });

  describe("databricks", () => {
    it("should return databricks configuration with all properties", () => {
      // Arrange
      const oauthClientSecret = faker.string.alphanumeric(20);
      const mockConfig = {
        NODE_ENV: "production",
        APP_NAME: "test-app",
        DATABRICKS_SERVER_HOSTNAME: "databricks.example.com",
        DATABRICKS_HTTP_PATH: "/sql/1.0/warehouses/abc123",
        DATABRICKS_CATALOG: "main_catalog",
        DATABRICKS_SCHEMA: "main_schema",
        DATABRICKS_AZURE_TENANT_ID: "tenant-123",
        DATABRICKS_OAUTH_CLIENT_ID: "client-456",
        DATABRICKS_OAUTH_CLIENT_SECRET: oauthClientSecret,
      };

      jest.spyOn(configService, "get").mockImplementation((key: string) => {
        return mockConfig[key];
      });

      // Act
      const result = service.databricks;

      // Assert
      expect(result).toEqual({
        host: "databricks.example.com",
        path: "/sql/1.0/warehouses/abc123",
        catalog: "main_catalog",
        schema: "main_schema",
        azureTenantId: "tenant-123",
        oauthClientId: "client-456",
        oauthClientSecret,
        sessionConfig: {
          configuration: {
            query_tags: "environment:production,app:test-app",
          },
        },
        sqlPlaceholders: {
          DATABRICKS_SCHEMA: "main_schema",
          KPI_TABLE: undefined,
          KPI_GROUP_TABLE: "owr_datelimit_freeze_gld",
        },
      });
    });

    it("resolves KPI_GROUP_TABLE to the UAT table when NODE_ENV=uat", () => {
      jest.spyOn(configService, "get").mockImplementation((key: string) => {
        if (key === "NODE_ENV") return "uat";
        return undefined;
      });

      const result = service.databricks;

      expect(result.sqlPlaceholders.KPI_GROUP_TABLE).toBe("owr_datelimit_gld");
    });

    it("resolves KPI_GROUP_TABLE to the freeze table for non-UAT environments", () => {
      jest.spyOn(configService, "get").mockImplementation((key: string) => {
        if (key === "NODE_ENV") return "production";
        return undefined;
      });

      const result = service.databricks;

      expect(result.sqlPlaceholders.KPI_GROUP_TABLE).toBe(
        "owr_datelimit_freeze_gld",
      );
    });

    it("should generate query_tags with NODE_ENV and APP_NAME", () => {
      // Arrange
      jest.spyOn(configService, "get").mockImplementation((key: string) => {
        if (key === "NODE_ENV") return "development";
        if (key === "APP_NAME") return "my-service";
        return "value";
      });

      // Act
      const result = service.databricks;

      // Assert
      expect(result.sessionConfig.configuration.query_tags).toBe(
        "environment:development,app:my-service",
      );
    });

    it("should handle undefined NODE_ENV and APP_NAME", () => {
      // Arrange
      jest.spyOn(configService, "get").mockImplementation((key: string) => {
        if (key === "NODE_ENV") return undefined;
        if (key === "APP_NAME") return undefined;
        return "value";
      });

      // Act
      const result = service.databricks;

      // Assert
      expect(result.sessionConfig.configuration.query_tags).toBe(
        "environment:undefined,app:undefined",
      );
    });

    it("should handle all databricks properties as undefined", () => {
      // Arrange
      jest.spyOn(configService, "get").mockReturnValue(undefined);

      // Act
      const result = service.databricks;

      // Assert
      expect(result.host).toBeUndefined();
      expect(result.path).toBeUndefined();
      expect(result.catalog).toBeUndefined();
      expect(result.schema).toBeUndefined();
      expect(result.azureTenantId).toBeUndefined();
      expect(result.oauthClientId).toBeUndefined();
      expect(result.oauthClientSecret).toBeUndefined();
      expect(result.sqlPlaceholders.DATABRICKS_SCHEMA).toBeUndefined();
      expect(result.sqlPlaceholders.KPI_TABLE).toBeUndefined();
    });
  });
});
