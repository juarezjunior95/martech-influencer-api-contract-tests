import { yearByYearPowerAcPowerMixHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/power-performance-trend/year-by-year-power-ac-power-mix.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("YearByYearPowerAcPowerMixHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with value and dt_ini fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "95.5",
            DT_INI: "2024-01-01",
          },
        ],
      };

      // Act
      const result = await yearByYearPowerAcPowerMixHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        value: "95.5",
        dt_ini: "2024-01-01",
      });
    });

    it("should process multiple data items", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "95.5",
            DT_INI: "2023-01-01",
          },
          {
            AC: "88.2",
            DT_INI: "2024-01-01",
          },
          {
            AC: "92.8",
            DT_INI: "2025-01-01",
          },
        ],
      };

      // Act
      const result = await yearByYearPowerAcPowerMixHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ value: "95.5", dt_ini: "2023-01-01" });
      expect(result[1]).toEqual({ value: "88.2", dt_ini: "2024-01-01" });
      expect(result[2]).toEqual({ value: "92.8", dt_ini: "2025-01-01" });
    });

    it("should handle zero values", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "0",
            DT_INI: "2024-01-01",
          },
        ],
      };

      // Act
      const result = await yearByYearPowerAcPowerMixHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: "0", dt_ini: "2024-01-01" });
    });

    it("should handle numeric values", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: 156.89,
            DT_INI: "2025-01-01",
          },
        ],
      };

      // Act
      const result = await yearByYearPowerAcPowerMixHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: 156.89, dt_ini: "2025-01-01" });
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await yearByYearPowerAcPowerMixHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
