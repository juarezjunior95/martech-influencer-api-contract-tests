import { byZoneMaturityPerformanceDetailsHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/performance-breakdown/by-zone-maturity-performance-details.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("ByZoneMaturityPerformanceDetailsHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "BRA",
            AC: "250.5",
            AC_VS_LY: "10.2",
            AC_VS_LQ: "5.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
          },
        ],
      };

      // Act
      const result = await byZoneMaturityPerformanceDetailsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        country: "BRA",
        label_ac: expect.stringMatching(/^AC - (Q4'23|FY'23)$/),
        ac: "250.5",
        label_ly: expect.stringMatching(/^LY - (Q4'22|FY'22)$/),
        ac_vs_ly: "10.2",
        variation_direction_ly: "up",
        label_lq: "LQ - FY'23",
        ac_vs_lq: "5.5",
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
            COUNTRY_ISO_CODE_3: "USA",
            AC: "180.0",
            AC_VS_LY: "-4.5",
            AC_VS_LQ: "-3.2",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
            LEVEL_1: "Core",
          },
        ],
      };

      // Act
      const result = await byZoneMaturityPerformanceDetailsHandler.handle(
        [],
        mockDataset,
      );

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
            COUNTRY_ISO_CODE_3: "MEX",
            AC: "95.0",
            AC_VS_LY: "0",
            AC_VS_LQ: "0",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
            LEVEL_1: "Economy",
          },
        ],
      };

      // Act
      const result = await byZoneMaturityPerformanceDetailsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result[0].label_ly).not.toContain("vs ");
      expect(result[0].label_lq).not.toContain("vs ");
      expect(result[0].label_ly).toContain("LY - ");
      expect(result[0].label_lq).toContain("LQ - ");
    });

    it("should process multiple countries", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "BRA",
            AC: "250.5",
            AC_VS_LY: "10.2",
            AC_VS_LQ: "5.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Premium",
          },
          {
            COUNTRY_ISO_CODE_3: "ARG",
            AC: "130.0",
            AC_VS_LY: "6.0",
            AC_VS_LQ: "3.0",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
            LEVEL_1: "Core",
          },
        ],
      };

      // Act
      const result = await byZoneMaturityPerformanceDetailsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].country).toBe("BRA");
      expect(result[1].country).toBe("ARG");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await byZoneMaturityPerformanceDetailsHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
