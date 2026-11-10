import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ValidationParamPipe } from "@common/pipes/validation-param.pipe";

describe("ValidationParamPipe", () => {
  let pipe: ValidationParamPipe;

  beforeEach(() => {
    pipe = new ValidationParamPipe();
  });

  describe("transform", () => {
    it("should return value when value is provided", () => {
      // Arrange
      const value = "test-value";
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "id",
      };

      // Act
      const result = pipe.transform(value, metadata);

      // Assert
      expect(result).toBe(value);
    });

    it("should return value when value is a number", () => {
      // Arrange
      const value = 123;
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "userId",
      };

      // Act
      const result = pipe.transform(value, metadata);

      // Assert
      expect(result).toBe(123);
    });

    it("should return value when value is a boolean true", () => {
      // Arrange
      const value = true;
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "isActive",
      };

      // Act
      const result = pipe.transform(value, metadata);

      // Assert
      expect(result).toBe(true);
    });

    it("should return value when value is an object", () => {
      // Arrange
      const value = { name: "test", id: 1 };
      const metadata: ArgumentMetadata = {
        type: "body",
        data: "dto",
      };

      // Act
      const result = pipe.transform(value, metadata);

      // Assert
      expect(result).toEqual(value);
    });

    it("should return value when value is an array", () => {
      // Arrange
      const value = [1, 2, 3];
      const metadata: ArgumentMetadata = {
        type: "query",
        data: "items",
      };

      // Act
      const result = pipe.transform(value, metadata);

      // Assert
      expect(result).toEqual(value);
    });

    it("should throw BadRequestException when value is null", () => {
      // Arrange
      const value = null;
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "id",
      };

      // Act & Assert
      expect(() => pipe.transform(value, metadata)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform(value, metadata)).toThrow(
        "O valor do parametro id deve ser informado",
      );
    });

    it("should throw BadRequestException when value is undefined", () => {
      // Arrange
      const value = undefined;
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "userId",
      };

      // Act & Assert
      expect(() => pipe.transform(value, metadata)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform(value, metadata)).toThrow(
        "O valor do parametro userId deve ser informado",
      );
    });

    it("should throw BadRequestException when value is empty string", () => {
      // Arrange
      const value = "";
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "name",
      };

      // Act & Assert
      expect(() => pipe.transform(value, metadata)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform(value, metadata)).toThrow(
        "O valor do parametro name deve ser informado",
      );
    });

    it("should throw BadRequestException when value is 0", () => {
      // Arrange
      const value = 0;
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "count",
      };

      // Act & Assert
      expect(() => pipe.transform(value, metadata)).toThrow(
        BadRequestException,
      );
    });

    it("should throw BadRequestException when value is false", () => {
      // Arrange
      const value = false;
      const metadata: ArgumentMetadata = {
        type: "query",
        data: "isEnabled",
      };

      // Act & Assert
      expect(() => pipe.transform(value, metadata)).toThrow(
        BadRequestException,
      );
    });

    it("should include parameter name in error message", () => {
      // Arrange
      const value = null;
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "customParam",
      };

      // Act & Assert
      try {
        pipe.transform(value, metadata);
        fail("Should have thrown BadRequestException");
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain("customParam");
      }
    });

    it("should handle metadata without data property", () => {
      // Arrange
      const value = null;
      const metadata: ArgumentMetadata = {
        type: "param",
      };

      // Act & Assert
      expect(() => pipe.transform(value, metadata)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform(value, metadata)).toThrow(
        "O valor do parametro undefined deve ser informado",
      );
    });

    it("should return value when value is whitespace string", () => {
      // Arrange
      const value = "   ";
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "text",
      };

      // Act
      const result = pipe.transform(value, metadata);

      // Assert
      expect(result).toBe("   ");
    });

    it("should return value when value is negative number", () => {
      // Arrange
      const value = -5;
      const metadata: ArgumentMetadata = {
        type: "param",
        data: "temperature",
      };

      // Act
      const result = pipe.transform(value, metadata);

      // Assert
      expect(result).toBe(-5);
    });
  });
});
