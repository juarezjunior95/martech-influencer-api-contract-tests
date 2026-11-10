import { byTrendOverTimeHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/power-performance-trend/by-trend-over-time.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("ByTrendOverTimeHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "120.5",
            AC_VS_LY: "6.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
        ],
      };

      // Act
      const result = await byTrendOverTimeHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        value: "120.5",
        variation: "6.5",
        variation_direction: "up",
        label: expect.stringMatching(/^(Q4'23|FY'23)$/),
      });
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "95.0",
            AC_VS_LY: "-4.2",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
          },
        ],
      };

      // Act
      const result = await byTrendOverTimeHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction).toBe("down");
      expect(result[0].variation).toBe("-4.2");
    });

    it("should handle zero variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "100.0",
            AC_VS_LY: "0",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
          },
        ],
      };

      // Act
      const result = await byTrendOverTimeHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction).toBe("down");
    });

    it("should format period labels correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "110.0",
            AC_VS_LY: "3.0",
            DT_INI: "2023-04-01",
            DT_END: "2023-06-30",
          },
        ],
      };

      // Act
      const result = await byTrendOverTimeHandler.handle([], mockDataset);

      // Assert
      expect(result[0].label).toMatch(/^(Q2'23|FY'23)$/);
    });

    it("should process multiple data items with different periods", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "120.5",
            AC_VS_LY: "6.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
          {
            AC: "115.0",
            AC_VS_LY: "-2.0",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
          },
          {
            AC: "110.0",
            AC_VS_LY: "0",
            DT_INI: "2023-04-01",
            DT_END: "2023-06-30",
          },
        ],
      };

      // Act
      const result = await byTrendOverTimeHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].label).toMatch(/^(Q4'23|FY'23)$/);
      expect(result[1].label).toMatch(/^(Q3'23|FY'23)$/);
      expect(result[2].label).toMatch(/^(Q2'23|FY'23)$/);
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await byTrendOverTimeHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
