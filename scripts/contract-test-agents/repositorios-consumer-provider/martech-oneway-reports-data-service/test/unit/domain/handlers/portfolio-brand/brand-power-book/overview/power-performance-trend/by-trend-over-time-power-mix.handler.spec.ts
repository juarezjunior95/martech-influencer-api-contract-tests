import { byTrendOverTimePowerMixHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/power-performance-trend/by-trend-over-time-power-mix.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("ByTrendOverTimePowerMixHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with value and dt_ini fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "85.5",
            DT_INI: "2024-01-01",
          },
        ],
      };

      // Act
      const result = await byTrendOverTimePowerMixHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        value: "85.5",
        dt_ini: "2024-01-01",
      });
    });

    it("should process multiple data items", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "85.5",
            DT_INI: "2024-01-01",
          },
          {
            AC: "90.2",
            DT_INI: "2024-04-01",
          },
          {
            AC: "78.8",
            DT_INI: "2024-07-01",
          },
        ],
      };

      // Act
      const result = await byTrendOverTimePowerMixHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ value: "85.5", dt_ini: "2024-01-01" });
      expect(result[1]).toEqual({ value: "90.2", dt_ini: "2024-04-01" });
      expect(result[2]).toEqual({ value: "78.8", dt_ini: "2024-07-01" });
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
      const result = await byTrendOverTimePowerMixHandler.handle(
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
            AC: 125.75,
            DT_INI: "2024-10-01",
          },
        ],
      };

      // Act
      const result = await byTrendOverTimePowerMixHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: 125.75, dt_ini: "2024-10-01" });
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await byTrendOverTimePowerMixHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
