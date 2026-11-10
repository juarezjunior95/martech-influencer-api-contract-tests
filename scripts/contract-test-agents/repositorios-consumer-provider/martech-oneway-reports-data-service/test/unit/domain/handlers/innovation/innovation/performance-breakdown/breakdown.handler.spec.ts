import { breakdownHandler } from "@domain/handlers/innovation/innovation/performance-breakdown/breakdown.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("BreakdownHandler", () => {
  describe("handle", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            KPI_NAME: "innovation_volume",
            RAW_BRAND: "Brahma",
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-12-31",
            LE: 1000.5,
            LE_TOTAL: 5000.0,
            LE_LY_TOTAL: 4800.0,
            LE_VS_LY: 5.2,
            LE_VS_BU: 3.1,
            GROWTH_CONTRIB: 0.2,
          },
        ],
      };

      // Act
      const result = await breakdownHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        kpi_name: "innovation_volume",
        brand: "Brahma",
        country: "BRA",
        dt_ini: "2023-01-01",
        dt_end: "2023-12-31",
        le: 1000.5,
        le_total: 5000.0,
        le_ly_total: 4800.0,
        le_vs_ly: 5.2,
        le_vs_bu: 3.1,
        growth_cont: 0.2,
      });
      expect(result[0].brand_image).toBeTruthy();
      expect(typeof result[0].brand_image).toBe("string");
      expect(result[0].country_flag).toBeTruthy();
      expect(typeof result[0].country_flag).toBe("string");
      expect(result[0].le_vs_ly_direction).toBe("up");
      expect(result[0].le_vs_bu_direction).toBe("up");
      expect(result[0].growth_cont_direction).toBe("up");
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            KPI_NAME: "innovation_maco",
            RAW_BRAND: "Antarctica",
            COUNTRY_ISO_CODE_3: "GBR",
            DT_INI: "2023-04-01",
            DT_END: "2023-06-30",
            LE: 300.2,
            LE_TOTAL: 2000.0,
            LE_LY_TOTAL: 2100.0,
            LE_VS_LY: -2.5,
            LE_VS_BU: -1.8,
            GROWTH_CONTRIB: -0.1,
          },
        ],
      };

      // Act
      const result = await breakdownHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].le_vs_ly_direction).toBe("down");
      expect(result[0].le_vs_bu_direction).toBe("down");
      expect(result[0].growth_cont_direction).toBe("down");
    });

    it("should handle zero variations correctly with positiveZero option", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            KPI_NAME: "innovation_volume",
            RAW_BRAND: "Brahma",
            COUNTRY_ISO_CODE_3: "FRA",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
            LE: 200.0,
            LE_TOTAL: 1000.0,
            LE_LY_TOTAL: 1000.0,
            LE_VS_LY: 0,
            LE_VS_BU: 0,
            GROWTH_CONTRIB: 0,
          },
        ],
      };

      // Act
      const result = await breakdownHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].le_vs_ly_direction).toBe("up");
      expect(result[0].le_vs_bu_direction).toBe("up");
      expect(result[0].growth_cont_direction).toBe("up");
    });

    it("should process multiple data items", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            KPI_NAME: "innovation_volume",
            RAW_BRAND: "Brahma",
            COUNTRY_ISO_CODE_3: "USA",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
            LE: 1000.5,
            LE_TOTAL: 5000.0,
            LE_LY_TOTAL: 4800.0,
            LE_VS_LY: 5.2,
            LE_VS_BU: 3.1,
            GROWTH_CONTRIB: 0.2,
          },
          {
            KPI_NAME: "innovation_nr",
            RAW_BRAND: "Skol",
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2023-04-01",
            DT_END: "2023-06-30",
            LE: 500.8,
            LE_TOTAL: 3000.0,
            LE_LY_TOTAL: 3200.0,
            LE_VS_LY: -2.1,
            LE_VS_BU: -1.5,
            GROWTH_CONTRIB: -0.05,
          },
          {
            KPI_NAME: "innovation_maco",
            RAW_BRAND: "Antarctica",
            COUNTRY_ISO_CODE_3: "GBR",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
            LE: 300.2,
            LE_TOTAL: 2000.0,
            LE_LY_TOTAL: 2000.0,
            LE_VS_LY: 0,
            LE_VS_BU: 0,
            GROWTH_CONTRIB: 0,
          },
        ],
      };

      // Act
      const result = await breakdownHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].brand).toBe("Brahma");
      expect(result[0].country).toBe("USA");
      expect(result[0].le_vs_ly_direction).toBe("up");
      expect(result[1].brand).toBe("Skol");
      expect(result[1].country).toBe("BRA");
      expect(result[1].le_vs_ly_direction).toBe("down");
      expect(result[2].brand).toBe("Antarctica");
      expect(result[2].country).toBe("GBR");
      expect(result[2].le_vs_ly_direction).toBe("up");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await breakdownHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should throw an error if defaultDataset is not provided", async () => {
      // Arrange
      const mockDatasets: Dataset[] = [];

      // Act & Assert
      await expect(
        breakdownHandler.handle(mockDatasets, undefined),
      ).rejects.toThrow();
    });

    it("should accept lowercase field names from normalized entities", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            kpi_name: "innovation_volume",
            raw_brand: "Brahma",
            country_iso_code_3: "BRA",
            dt_ini: "2023-01-01",
            dt_end: "2023-12-31",
            le: 1000.5,
            le_total: 5000.0,
            le_ly_total: 4800.0,
            le_vs_ly: 5.2,
            le_vs_bu: 3.1,
            growth_contrib: 0.2,
          },
        ],
      };

      const result = await breakdownHandler.handle([], mockDataset);

      expect(result[0]).toMatchObject({
        kpi_name: "innovation_volume",
        brand: "Brahma",
        country: "BRA",
        growth_cont: 0.2,
        le_vs_ly_direction: "up",
      });
    });
  });
});
