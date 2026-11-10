import { portfolioPerformanceTableHandler } from "@domain/handlers/value-creation/portfolio-performance/overview/portfolio-performance-table.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("PortfolioPerformanceTableHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Premium",
            KPI_NAME: "volume",
            AC: "5.2",
            AC_VS_LY: "3.5",
            COUNTRY_ISO_CODE_3: "BRA",
            RAW_BRAND: "Brahma",
            BRAND_FAMILY: "Brahma Family",
            DT_END: "2023-12-31",
            DT_INI: "2023-10-01",
          },
        ],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        segment: "Premium",
        kpi_name: "volume",
        ac: "5.2",
        comp_ac_direction: "up",
        ac_vs_ly: "3.5",
        comp_ac_ly_direction: "up",
        unit_measure: "%",
        country: "BRA",
        brand: "Brahma",
        brand_family: "Brahma Family",
        period_refresh: "Q4'23",
        month_refresh: "Dec'23",
      });
      expect(result[0].brand_image).toBeTruthy();
      expect(typeof result[0].brand_image).toBe("string");
    });

    it("should process lowercase dataset fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            segment: "Megabrands",
            kpi_name: "volume",
            ac: "10.2",
            ac_vs_ly: "-1.3",
            country_iso_code_3: "MEX",
            raw_brand: "Corona",
            brand_family: "Corona Family",
            dt_end: "2023-12-31",
            dt_ini: "2023-10-01",
          },
        ],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        segment: "Megabrands",
        kpi_name: "volume",
        ac: "10.2",
        comp_ac_direction: "up",
        ac_vs_ly: "-1.3",
        comp_ac_ly_direction: "down",
        unit_measure: "%",
        country: "MEX",
        brand: "Corona",
        brand_family: "Corona Family",
        period_refresh: "Q4'23",
        month_refresh: "Dec'23",
      });
      expect(result[0].brand_image).toBeTruthy();
    });

    it("should handle power KPI with pp unit measure", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Core",
            KPI_NAME: "power",
            AC: "2.1",
            AC_VS_LY: "1.8",
            COUNTRY_ISO_CODE_3: "ARG",
            RAW_BRAND: "Stella Artois",
            BRAND_FAMILY: "Stella Artois Family",
            DT_END: "2023-06-30",
            DT_INI: "2023-04-01",
          },
        ],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].unit_measure).toBe("pp");
      expect(result[0].kpi_name).toBe("power");
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Economy",
            KPI_NAME: "revenue",
            AC: "-2.5",
            AC_VS_LY: "-1.8",
            COUNTRY_ISO_CODE_3: "USA",
            RAW_BRAND: "Budweiser",
            BRAND_FAMILY: "Budweiser Family",
            DT_END: "2023-09-30",
            DT_INI: "2023-07-01",
          },
        ],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].comp_ac_direction).toBe("down");
      expect(result[0].comp_ac_ly_direction).toBe("down");
    });

    it("should handle zero variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Core",
            KPI_NAME: "market_share",
            AC: "0",
            AC_VS_LY: "0",
            COUNTRY_ISO_CODE_3: "MEX",
            RAW_BRAND: "Corona",
            BRAND_FAMILY: "Corona Family",
            DT_END: "2023-03-31",
            DT_INI: "2023-01-01",
          },
        ],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].comp_ac_direction).toBe("down");
      expect(result[0].comp_ac_ly_direction).toBe("down");
    });

    it("should format dates correctly for quarters and months", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Premium",
            KPI_NAME: "volume",
            AC: "5.2",
            AC_VS_LY: "3.5",
            COUNTRY_ISO_CODE_3: "BRA",
            RAW_BRAND: "Brahma",
            BRAND_FAMILY: "Brahma Family",
            DT_END: "2023-03-31",
            DT_INI: "2023-01-01",
          },
        ],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].period_refresh).toBe("Q1'23");
      expect(result[0].month_refresh).toBe("Mar'23");
    });

    it("should process multiple data items", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Premium",
            KPI_NAME: "volume",
            AC: "5.2",
            AC_VS_LY: "3.5",
            COUNTRY_ISO_CODE_3: "BRA",
            RAW_BRAND: "Brahma",
            BRAND_FAMILY: "Brahma Family",
            DT_END: "2023-12-31",
            DT_INI: "2023-10-01",
          },
          {
            SEGMENT: "Core",
            KPI_NAME: "power",
            AC: "-1.5",
            AC_VS_LY: "2.0",
            COUNTRY_ISO_CODE_3: "ARG",
            RAW_BRAND: "Stella Artois",
            BRAND_FAMILY: "Stella Artois Family",
            DT_END: "2023-09-30",
            DT_INI: "2023-07-01",
          },
        ],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].brand).toBe("Brahma");
      expect(result[0].unit_measure).toBe("%");
      expect(result[1].brand).toBe("Stella Artois");
      expect(result[1].unit_measure).toBe("pp");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should generate brand images for all brands", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Premium",
            KPI_NAME: "volume",
            AC: "5.2",
            AC_VS_LY: "3.5",
            COUNTRY_ISO_CODE_3: "USA",
            RAW_BRAND: "Bud Light",
            BRAND_FAMILY: "Budweiser Family",
            DT_END: "2023-12-31",
            DT_INI: "2023-10-01",
          },
        ],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].brand_image).toBeTruthy();
      expect(typeof result[0].brand_image).toBe("string");
    });

    it("should handle mixed positive and negative directions", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            SEGMENT: "Core",
            KPI_NAME: "revenue",
            AC: "3.0",
            AC_VS_LY: "-2.5",
            COUNTRY_ISO_CODE_3: "CAN",
            RAW_BRAND: "Corona",
            BRAND_FAMILY: "Corona Family",
            DT_END: "2023-06-30",
            DT_INI: "2023-04-01",
          },
        ],
      };

      // Act
      const result = await portfolioPerformanceTableHandler.handle(
        [],
        mockDataset,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].comp_ac_direction).toBe("up");
      expect(result[0].comp_ac_ly_direction).toBe("down");
    });
  });
});
