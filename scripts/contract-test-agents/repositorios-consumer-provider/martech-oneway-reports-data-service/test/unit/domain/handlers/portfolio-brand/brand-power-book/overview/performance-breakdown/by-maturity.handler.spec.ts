import { byMaturityHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/performance-breakdown/by-maturity.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("ByMaturityHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            MATURITY: "Mature",
            AC: "150.5",
            AC_VS_LY: "8.3",
            AC_VS_LQ: "4.2",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
          },
        ],
      };

      // Act
      const result = await byMaturityHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        zone: "Mature",
        label_ac: expect.stringMatching(/^AC - (Q4'23|FY'23)$/),
        ac: "150.5",
        label_ly: expect.stringMatching(/^LY - (Q4'22|FY'22)$/),
        ac_vs_ly: "8.3",
        variation_direction_ly: "up",
        label_lq: "LQ - FY'23",
        ac_vs_lq: "4.2",
        variation_direction_lq: "up",
        level_1: "Premium",
      });
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            MATURITY: "Growing",
            AC: "120.0",
            AC_VS_LY: "-3.5",
            AC_VS_LQ: "-2.1",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
            LEVEL_1: "Core",
          },
        ],
      };

      // Act
      const result = await byMaturityHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction_ly).toBe("down");
      expect(result[0].variation_direction_lq).toBe("down");
    });

    it("should format labels correctly removing 'vs' prefix", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            MATURITY: "Emerging",
            AC: "75.0",
            AC_VS_LY: "0",
            AC_VS_LQ: "0",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
            LEVEL_1: "Economy",
          },
        ],
      };

      // Act
      const result = await byMaturityHandler.handle([], mockDataset);

      // Assert
      expect(result[0].label_ly).not.toContain("vs ");
      expect(result[0].label_lq).not.toContain("vs ");
      expect(result[0].label_ly).toContain("LY - ");
      expect(result[0].label_lq).toContain("LQ - ");
    });

    it("should process multiple maturity zones", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            MATURITY: "Mature",
            AC: "150.5",
            AC_VS_LY: "8.3",
            AC_VS_LQ: "4.2",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
          },
          {
            MATURITY: "Growing",
            AC: "100.0",
            AC_VS_LY: "5.0",
            AC_VS_LQ: "2.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Core",
          },
        ],
      };

      // Act
      const result = await byMaturityHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].zone).toBe("Mature");
      expect(result[1].zone).toBe("Growing");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await byMaturityHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
