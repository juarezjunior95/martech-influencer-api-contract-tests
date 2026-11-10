import { MissingRequiredFilterError } from "@domain/exceptions/missing-required-filter.error";
import { BadRequestException } from "@nestjs/common";

describe("MissingRequiredFilterError", () => {
  describe("constructor", () => {
    it("should create an error with the correct message", () => {
      // Arrange
      const filterName = "startDate";
      const datasourceName = "analytics-datasource";

      // Act
      const error = new MissingRequiredFilterError(filterName, datasourceName);

      // Assert
      expect(error.message).toBe(
        `Required filter 'startDate' is missing for datasource 'analytics-datasource'`,
      );
    });

    it("should set the correct error name", () => {
      // Arrange
      const filterName = "startDate";
      const datasourceName = "analytics-datasource";

      // Act
      const error = new MissingRequiredFilterError(filterName, datasourceName);

      // Assert
      expect(error.name).toBe("MissingRequiredFilterError");
    });

    it("should extend BadRequestException", () => {
      // Arrange
      const filterName = "startDate";
      const datasourceName = "analytics-datasource";

      // Act
      const error = new MissingRequiredFilterError(filterName, datasourceName);

      // Assert
      expect(error).toBeInstanceOf(BadRequestException);
    });

    it("should include filter name in the message", () => {
      // Arrange
      const filterName = "userId";
      const datasourceName = "user-datasource";

      // Act
      const error = new MissingRequiredFilterError(filterName, datasourceName);

      // Assert
      expect(error.message).toContain(filterName);
    });

    it("should include datasource name in the message", () => {
      // Arrange
      const filterName = "userId";
      const datasourceName = "user-datasource";

      // Act
      const error = new MissingRequiredFilterError(filterName, datasourceName);

      // Assert
      expect(error.message).toContain(datasourceName);
    });

    it("should handle empty filter name", () => {
      // Arrange
      const filterName = "";
      const datasourceName = "test-datasource";

      // Act
      const error = new MissingRequiredFilterError(filterName, datasourceName);

      // Assert
      expect(error.message).toBe(
        `Required filter '' is missing for datasource 'test-datasource'`,
      );
    });

    it("should handle empty datasource name", () => {
      // Arrange
      const filterName = "filter1";
      const datasourceName = "";

      // Act
      const error = new MissingRequiredFilterError(filterName, datasourceName);

      // Assert
      expect(error.message).toBe(
        `Required filter 'filter1' is missing for datasource ''`,
      );
    });

    it("should handle filter names with special characters", () => {
      // Arrange
      const filterName = "start_date-2024";
      const datasourceName = "reports-datasource";

      // Act
      const error = new MissingRequiredFilterError(filterName, datasourceName);

      // Assert
      expect(error.message).toBe(
        `Required filter 'start_date-2024' is missing for datasource 'reports-datasource'`,
      );
    });

    it("should handle datasource names with special characters", () => {
      // Arrange
      const filterName = "region";
      const datasourceName = "analytics_datasource-v2";

      // Act
      const error = new MissingRequiredFilterError(filterName, datasourceName);

      // Assert
      expect(error.message).toBe(
        `Required filter 'region' is missing for datasource 'analytics_datasource-v2'`,
      );
    });
  });
});
