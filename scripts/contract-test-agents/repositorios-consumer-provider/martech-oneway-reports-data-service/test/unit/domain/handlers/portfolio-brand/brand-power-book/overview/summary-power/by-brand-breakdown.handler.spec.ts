import { byBrandBreakdownHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/summary-power/by-brand-breakdown.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("ByBrandBreakdownHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            RAW_BRAND: "Budweiser",
            AC: "350.5",
            AC_VS_LY: "8.3",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
            KPI_NAME: "Volume",
          },
        ],
      };

      // Act
      const result = await byBrandBreakdownHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        brand: "Budweiser",
        label_ac: expect.stringMatching(/^AC - (Q4'23|FY'23)$/),
        ac: "350.5",
        label_ly: expect.stringMatching(/^(Q4'22|FY'22)$/),
        ac_vs_ly: "8.3",
        variation_direction_ly: "up",
        level_1: "Premium",
        kpi: "Volume",
      });
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            RAW_BRAND: "Corona",
            AC: "280.0",
            AC_VS_LY: "-5.5",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
            LEVEL_1: "Premium",
            KPI_NAME: "Revenue",
          },
        ],
      };

      // Act
      const result = await byBrandBreakdownHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction_ly).toBe("down");
      expect(result[0].ac_vs_ly).toBe("-5.5");
    });

    it("should remove 'vs' prefix from label_ly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            RAW_BRAND: "Stella Artois",
            AC: "220.0",
            AC_VS_LY: "0",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
            LEVEL_1: "Core",
            KPI_NAME: "Market Share",
          },
        ],
      };

      // Act
      const result = await byBrandBreakdownHandler.handle([], mockDataset);

      // Assert
      expect(result[0].label_ly).not.toContain("vs ");
      expect(result[0].label_ly).toMatch(/^(Q1'22|FY'22)$/);
    });

    it("should process multiple brands", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            RAW_BRAND: "Budweiser",
            AC: "350.5",
            AC_VS_LY: "8.3",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
            KPI_NAME: "Volume",
          },
          {
            RAW_BRAND: "Corona",
            AC: "280.0",
            AC_VS_LY: "-2.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
            KPI_NAME: "Volume",
          },
          {
            RAW_BRAND: "Brahma",
            AC: "420.0",
            AC_VS_LY: "12.0",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Core",
            KPI_NAME: "Volume",
          },
        ],
      };

      // Act
      const result = await byBrandBreakdownHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].brand).toBe("Budweiser");
      expect(result[1].brand).toBe("Corona");
      expect(result[2].brand).toBe("Brahma");
    });

    it("should handle zero variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            RAW_BRAND: "Skol",
            AC: "500.0",
            AC_VS_LY: "0",
            DT_INI: "2023-04-01",
            DT_END: "2023-06-30",
            LEVEL_1: "Economy",
            KPI_NAME: "Volume",
          },
        ],
      };

      // Act
      const result = await byBrandBreakdownHandler.handle([], mockDataset);

      // Assert
      expect(result[0].variation_direction_ly).toBe("down");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await byBrandBreakdownHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
