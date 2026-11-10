import { DatasourceNotFoundError } from "@domain/exceptions/datasource-not-found.error";
import { NotFoundException } from "@nestjs/common";

describe("DatasourceNotFoundError", () => {
  describe("constructor", () => {
    it("should create an error with the correct message", () => {
      // Arrange
      const datasourceName = "test-datasource";

      // Act
      const error = new DatasourceNotFoundError(datasourceName);

      // Assert
      expect(error.message).toBe(`Datasource 'test-datasource' not found`);
    });

    it("should set the correct error name", () => {
      // Arrange
      const datasourceName = "test-datasource";

      // Act
      const error = new DatasourceNotFoundError(datasourceName);

      // Assert
      expect(error.name).toBe("DatasourceNotFoundError");
    });

    it("should extend NotFoundException", () => {
      // Arrange
      const datasourceName = "test-datasource";

      // Act
      const error = new DatasourceNotFoundError(datasourceName);

      // Assert
      expect(error).toBeInstanceOf(NotFoundException);
    });

    it("should include datasource name in the message", () => {
      // Arrange
      const datasourceName = "my-custom-datasource";

      // Act
      const error = new DatasourceNotFoundError(datasourceName);

      // Assert
      expect(error.message).toContain(datasourceName);
    });

    it("should handle empty datasource name", () => {
      // Arrange
      const datasourceName = "";

      // Act
      const error = new DatasourceNotFoundError(datasourceName);

      // Assert
      expect(error.message).toBe(`Datasource '' not found`);
    });

    it("should handle datasource name with special characters", () => {
      // Arrange
      const datasourceName = "test-datasource_123@#";

      // Act
      const error = new DatasourceNotFoundError(datasourceName);

      // Assert
      expect(error.message).toBe(
        `Datasource 'test-datasource_123@#' not found`,
      );
    });
  });
});
