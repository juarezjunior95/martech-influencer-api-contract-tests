import { bySegmentPerformanceHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/summary-power/by-segment-performance.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("BySegmentPerformanceHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PRICE_TIER: "Super Premium",
            LEVEL_1: "Premium",
            AC: "450.5",
            AC_VS_LY: "9.3",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
        ],
      };

      // Act
      const result = await bySegmentPerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        price_tier: "Super Premium",
        segment: "Premium",
        label_ac: expect.stringMatching(/^AC - (Q4'23|FY'23)$/),
        ac: "450.5",
        label_ly: expect.stringMatching(/^LY - (Q4'22|FY'22)$/),
        ac_vs_ly: "9.3",
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
            PRICE_TIER: "Mainstream",
            LEVEL_1: "Core",
            AC: "380.0",
            AC_VS_LY: "-4.5",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
          },
        ],
      };

      // Act
      const result = await bySegmentPerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction_ly).toBe("down");
      expect(result[0].ac_vs_ly).toBe("-4.5");
    });

    it("should format labels correctly removing 'vs' prefix", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PRICE_TIER: "Value",
            LEVEL_1: "Economy",
            AC: "250.0",
            AC_VS_LY: "0",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
          },
        ],
      };

      // Act
      const result = await bySegmentPerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result[0].label_ly).not.toContain("vs ");
      expect(result[0].label_ly).toContain("LY - ");
      expect(result[0].label_ly).toMatch(/^LY - (Q1'22|FY'22)$/);
    });

    it("should process multiple price tiers and segments", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PRICE_TIER: "Super Premium",
            LEVEL_1: "Premium",
            AC: "450.5",
            AC_VS_LY: "9.3",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
          {
            PRICE_TIER: "Premium",
            LEVEL_1: "Premium",
            AC: "420.0",
            AC_VS_LY: "6.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
          {
            PRICE_TIER: "Mainstream",
            LEVEL_1: "Core",
            AC: "380.0",
            AC_VS_LY: "3.2",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
          {
            PRICE_TIER: "Value",
            LEVEL_1: "Economy",
            AC: "250.0",
            AC_VS_LY: "-1.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
        ],
      };

      // Act
      const result = await bySegmentPerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(4);
      expect(result[0].price_tier).toBe("Super Premium");
      expect(result[1].price_tier).toBe("Premium");
      expect(result[2].price_tier).toBe("Mainstream");
      expect(result[3].price_tier).toBe("Value");
    });

    it("should handle zero variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PRICE_TIER: "Premium Plus",
            LEVEL_1: "Premium",
            AC: "390.0",
            AC_VS_LY: "0",
            DT_INI: "2023-04-01",
            DT_END: "2023-06-30",
          },
        ],
      };

      // Act
      const result = await bySegmentPerformanceHandler.handle([], mockDataset);

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
      const result = await bySegmentPerformanceHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
