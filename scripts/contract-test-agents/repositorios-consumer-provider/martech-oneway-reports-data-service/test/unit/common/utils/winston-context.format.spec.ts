import {
  winstonContextFormat,
  requestContextStorage,
} from "@common/utils/winston-context.format";

describe("winstonContextFormat", () => {
  describe("with context in storage", () => {
    it("should add requestTraceId to log info", () => {
      // Arrange
      const context = {
        requestTraceId: "trace-123",
        country: "US",
      };
      const info = { message: "test message", level: "info" };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toEqual({
        message: "test message",
        level: "info",
        requestTraceId: "trace-123",
        country: "US",
      });
    });

    it("should add country to log info", () => {
      // Arrange
      const context = {
        requestTraceId: "trace-456",
        country: "BR",
      };
      const info = { message: "test message", level: "info" };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toHaveProperty("country", "BR");
    });

    it("should add both requestTraceId and country", () => {
      // Arrange
      const context = {
        requestTraceId: "trace-789",
        country: "MX",
      };
      const info = { message: "test message", level: "warn" };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toHaveProperty("requestTraceId", "trace-789");
      expect(result).toHaveProperty("country", "MX");
    });

    it("should not add requestTraceId if not present in context", () => {
      // Arrange
      const context = {
        country: "AR",
      };
      const info = { message: "test message", level: "info" };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toEqual({
        message: "test message",
        level: "info",
        country: "AR",
      });
      expect(result).not.toHaveProperty("requestTraceId");
    });

    it("should not add country if not present in context", () => {
      // Arrange
      const context = {
        requestTraceId: "trace-999",
      };
      const info = { message: "test message", level: "info" };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toEqual({
        message: "test message",
        level: "info",
        requestTraceId: "trace-999",
      });
      expect(result).not.toHaveProperty("country");
    });
  });

  describe("without context in storage", () => {
    it("should return info unchanged when no context is stored", () => {
      // Arrange
      const info = { message: "test message", level: "info" };

      // Act
      const result = winstonContextFormat().transform(info);

      // Assert
      expect(result).toEqual({
        message: "test message",
        level: "info",
      });
    });

    it("should not add any extra properties", () => {
      // Arrange
      const info = { message: "test message", level: "error" };

      // Act
      const result = winstonContextFormat().transform(info);

      // Assert
      expect(result).not.toHaveProperty("requestTraceId");
      expect(result).not.toHaveProperty("country");
    });
  });

  describe("preserving existing info properties", () => {
    it("should preserve existing properties in info", () => {
      // Arrange
      const context = {
        requestTraceId: "trace-123",
        country: "US",
      };
      const info = {
        message: "test message",
        level: "info",
        timestamp: "2024-01-01",
        customField: "custom value",
      };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toEqual({
        message: "test message",
        level: "info",
        timestamp: "2024-01-01",
        customField: "custom value",
        requestTraceId: "trace-123",
        country: "US",
      });
    });

    it("should not override existing requestTraceId", () => {
      // Arrange
      const context = {
        requestTraceId: "trace-from-context",
        country: "US",
      };
      const info = {
        message: "test message",
        level: "info",
        requestTraceId: "trace-existing",
      };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toHaveProperty("requestTraceId", "trace-from-context");
    });
  });

  describe("edge cases", () => {
    it("should handle empty context object", () => {
      // Arrange
      const context = {};
      const info = { message: "test message", level: "info" };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toEqual({
        message: "test message",
        level: "info",
      });
    });

    it("should handle minimal info object", () => {
      // Arrange
      const context = {
        requestTraceId: "trace-123",
        country: "US",
      };
      const info = { message: "", level: "info" };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toEqual({
        message: "",
        level: "info",
        requestTraceId: "trace-123",
        country: "US",
      });
    });

    it("should handle special characters in requestTraceId", () => {
      // Arrange
      const context = {
        requestTraceId: "trace-123-abc-@#$",
        country: "US",
      };
      const info = { message: "test message", level: "info" };

      // Act
      const result = requestContextStorage.run(context, () => {
        return winstonContextFormat().transform(info);
      });

      // Assert
      expect(result).toHaveProperty("requestTraceId", "trace-123-abc-@#$");
    });
  });
});
