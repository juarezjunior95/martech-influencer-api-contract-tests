import { byPortfolioPerformanceHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/summary-power/by-portfolio-performance.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("ByPortfolioPerformanceHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Premium Portfolio",
            AC: "750.5",
            AC_VS_LY: "10.2",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
          },
        ],
      };

      // Act
      const result = await byPortfolioPerformanceHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        portifolio: "Premium Portfolio",
        label_ac: expect.stringMatching(/^AC - (Q4'23|FY'23)$/),
        ac: "750.5",
        label_ly: expect.stringMatching(/^LY - (Q4'22|FY'22)$/),
        ac_vs_ly: "10.2",
        variation_direction_ly: "up",
        level_1: "Premium",
      });
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Core Portfolio",
            AC: "520.0",
            AC_VS_LY: "-6.5",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
            LEVEL_1: "Core",
          },
        ],
      };

      // Act
      const result = await byPortfolioPerformanceHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction_ly).toBe("down");
      expect(result[0].ac_vs_ly).toBe("-6.5");
    });

    it("should format labels correctly removing 'vs' prefix", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Economy Portfolio",
            AC: "380.0",
            AC_VS_LY: "0",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
            LEVEL_1: "Economy",
          },
        ],
      };

      // Act
      const result = await byPortfolioPerformanceHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result[0].label_ly).not.toContain("vs ");
      expect(result[0].label_ly).toContain("LY - ");
      expect(result[0].label_ly).toMatch(/^LY - (Q1'22|FY'22)$/);
    });

    it("should process multiple portfolio segments", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Premium Portfolio",
            AC: "750.5",
            AC_VS_LY: "10.2",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
          },
          {
            SEGMENT: "Core Portfolio",
            AC: "520.0",
            AC_VS_LY: "5.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Core",
          },
          {
            SEGMENT: "Economy Portfolio",
            AC: "380.0",
            AC_VS_LY: "-2.0",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Economy",
          },
        ],
      };

      // Act
      const result = await byPortfolioPerformanceHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].portifolio).toBe("Premium Portfolio");
      expect(result[1].portifolio).toBe("Core Portfolio");
      expect(result[2].portifolio).toBe("Economy Portfolio");
    });

    it("should handle zero variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Mid-Tier Portfolio",
            AC: "600.0",
            AC_VS_LY: "0",
            DT_INI: "2023-04-01",
            DT_END: "2023-06-30",
            LEVEL_1: "Core",
          },
        ],
      };

      // Act
      const result = await byPortfolioPerformanceHandler.handle(
        [],
        mockDataset,
      );

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
      const result = await byPortfolioPerformanceHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
