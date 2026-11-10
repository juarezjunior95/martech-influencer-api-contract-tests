import { Test, TestingModule } from "@nestjs/testing";
import { HeaderContextService } from "@common/services/header-context.service";
import { HeaderContext } from "@common/interfaces/header-context.interface";
import { requestContextStorage } from "@common/utils/winston-context.format";

describe("HeaderContextService", () => {
  let service: HeaderContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeaderContextService],
    }).compile();

    service = await module.resolve<HeaderContextService>(HeaderContextService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("setHeaderContext", () => {
    it("should store header context", () => {
      // Arrange
      const context: HeaderContext = {
        authorization: "Bearer token123",
        requestTraceId: "trace-123",
        country: "BR",
        accept: "application/json",
        acceptLanguage: "pt-BR",
        contentType: "application/json",
      };

      // Act
      service.setHeaderContext(context);

      // Assert
      expect(service.getHeaderContext()).toEqual(context);
    });

    it("should update header context when called multiple times", () => {
      // Arrange
      const firstContext: HeaderContext = {
        requestTraceId: "trace-1",
        country: "BR",
      };
      const secondContext: HeaderContext = {
        requestTraceId: "trace-2",
        country: "US",
      };

      // Act
      service.setHeaderContext(firstContext);
      service.setHeaderContext(secondContext);

      // Assert
      expect(service.getHeaderContext()).toEqual(secondContext);
    });

    it("should store context in AsyncLocalStorage for Winston", () => {
      // Arrange
      const context: HeaderContext = {
        requestTraceId: "trace-456",
        country: "MX",
      };
      const enterWithSpy = jest.spyOn(requestContextStorage, "enterWith");

      // Act
      service.setHeaderContext(context);

      // Assert
      expect(enterWithSpy).toHaveBeenCalledWith(context);
    });

    it("should handle context with only required fields", () => {
      // Arrange
      const context: HeaderContext = {
        requestTraceId: "trace-789",
      };

      // Act
      service.setHeaderContext(context);

      // Assert
      expect(service.getHeaderContext()).toEqual(context);
    });

    it("should handle context with all undefined fields", () => {
      // Arrange
      const context: HeaderContext = {
        authorization: undefined,
        requestTraceId: undefined,
        country: undefined,
        accept: undefined,
        acceptLanguage: undefined,
        contentType: undefined,
      };

      // Act
      service.setHeaderContext(context);

      // Assert
      expect(service.getHeaderContext()).toEqual(context);
    });
  });

  describe("getHeaderContext", () => {
    it("should return null when no context is set", () => {
      // Act
      const result = service.getHeaderContext();

      // Assert
      expect(result).toBeNull();
    });

    it("should return stored header context", () => {
      // Arrange
      const context: HeaderContext = {
        authorization: "Bearer token456",
        requestTraceId: "trace-456",
        country: "AR",
      };
      service.setHeaderContext(context);

      // Act
      const result = service.getHeaderContext();

      // Assert
      expect(result).toEqual(context);
    });

    it("should return the most recent context", () => {
      // Arrange
      const oldContext: HeaderContext = {
        requestTraceId: "old-trace",
        country: "BR",
      };
      const newContext: HeaderContext = {
        requestTraceId: "new-trace",
        country: "CL",
      };

      service.setHeaderContext(oldContext);
      service.setHeaderContext(newContext);

      // Act
      const result = service.getHeaderContext();

      // Assert
      expect(result).toEqual(newContext);
      expect(result).not.toEqual(oldContext);
    });
  });

  describe("getRequestTraceId", () => {
    it("should return undefined when no context is set", () => {
      // Act
      const result = service.getRequestTraceId();

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return requestTraceId from context", () => {
      // Arrange
      const context: HeaderContext = {
        requestTraceId: "trace-123-abc",
        country: "BR",
      };
      service.setHeaderContext(context);

      // Act
      const result = service.getRequestTraceId();

      // Assert
      expect(result).toBe("trace-123-abc");
    });

    it("should return undefined when requestTraceId is not set in context", () => {
      // Arrange
      const context: HeaderContext = {
        country: "US",
      };
      service.setHeaderContext(context);

      // Act
      const result = service.getRequestTraceId();

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return undefined when requestTraceId is explicitly undefined", () => {
      // Arrange
      const context: HeaderContext = {
        requestTraceId: undefined,
        country: "MX",
      };
      service.setHeaderContext(context);

      // Act
      const result = service.getRequestTraceId();

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe("getCountry", () => {
    it("should return undefined when no context is set", () => {
      // Act
      const result = service.getCountry();

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return country from context", () => {
      // Arrange
      const context: HeaderContext = {
        requestTraceId: "trace-789",
        country: "BR",
      };
      service.setHeaderContext(context);

      // Act
      const result = service.getCountry();

      // Assert
      expect(result).toBe("BR");
    });

    it("should return undefined when country is not set in context", () => {
      // Arrange
      const context: HeaderContext = {
        requestTraceId: "trace-456",
      };
      service.setHeaderContext(context);

      // Act
      const result = service.getCountry();

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return undefined when country is explicitly undefined", () => {
      // Arrange
      const context: HeaderContext = {
        requestTraceId: "trace-123",
        country: undefined,
      };
      service.setHeaderContext(context);

      // Act
      const result = service.getCountry();

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return correct country after multiple context updates", () => {
      // Arrange
      service.setHeaderContext({
        requestTraceId: "trace-1",
        country: "BR",
      });
      service.setHeaderContext({
        requestTraceId: "trace-2",
        country: "US",
      });

      // Act
      const result = service.getCountry();

      // Assert
      expect(result).toBe("US");
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete request lifecycle", () => {
      // Arrange
      const context: HeaderContext = {
        authorization: "Bearer complete-token",
        requestTraceId: "lifecycle-trace",
        country: "CO",
        accept: "application/json",
        acceptLanguage: "es-CO",
        contentType: "application/json",
      };

      // Act - Set context
      service.setHeaderContext(context);

      // Assert - Verify all getters
      expect(service.getHeaderContext()).toEqual(context);
      expect(service.getRequestTraceId()).toBe("lifecycle-trace");
      expect(service.getCountry()).toBe("CO");
    });

    it("should maintain context isolation between service instances", () => {
      // Arrange
      const context1: HeaderContext = {
        requestTraceId: "instance-1",
        country: "BR",
      };

      // Act
      service.setHeaderContext(context1);

      // Assert - This service instance should have its own context
      expect(service.getRequestTraceId()).toBe("instance-1");
      expect(service.getCountry()).toBe("BR");
    });
  });
});
