import { byZoneHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/performance-breakdown/by-zone.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("ByZoneHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            ABI_ZONE: "SAZ",
            AC: "500.5",
            AC_VS_LY: "12.3",
            AC_VS_LQ: "6.7",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
          },
        ],
      };

      // Act
      const result = await byZoneHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        zone: "SAZ",
        label_ac: expect.stringMatching(/^AC - (Q4'23|FY'23)$/),
        ac: "500.5",
        label_ly: expect.stringMatching(/^LY - (Q4'22|FY'22)$/),
        ac_vs_ly: "12.3",
        variation_direction_ly: "up",
        label_lq: "LQ - FY'23",
        ac_vs_lq: "6.7",
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
            ABI_ZONE: "NAZ",
            AC: "350.0",
            AC_VS_LY: "-5.5",
            AC_VS_LQ: "-4.2",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
            LEVEL_1: "Core",
          },
        ],
      };

      // Act
      const result = await byZoneHandler.handle([], mockDataset);

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
            ABI_ZONE: "Europe",
            AC: "280.0",
            AC_VS_LY: "0",
            AC_VS_LQ: "0",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
            LEVEL_1: "Economy",
          },
        ],
      };

      // Act
      const result = await byZoneHandler.handle([], mockDataset);

      // Assert
      expect(result[0].label_ly).not.toContain("vs ");
      expect(result[0].label_lq).not.toContain("vs ");
      expect(result[0].label_ly).toContain("LY - ");
      expect(result[0].label_lq).toContain("LQ - ");
    });

    it("should process multiple zones", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            ABI_ZONE: "SAZ",
            AC: "500.5",
            AC_VS_LY: "12.3",
            AC_VS_LQ: "6.7",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
          },
          {
            ABI_ZONE: "NAZ",
            AC: "450.0",
            AC_VS_LY: "8.0",
            AC_VS_LQ: "4.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Core",
          },
        ],
      };

      // Act
      const result = await byZoneHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].zone).toBe("SAZ");
      expect(result[1].zone).toBe("NAZ");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await byZoneHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
