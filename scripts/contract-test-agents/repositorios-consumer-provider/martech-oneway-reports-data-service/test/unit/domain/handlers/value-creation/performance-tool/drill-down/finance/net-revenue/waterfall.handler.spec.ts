import { waterfallHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/finance/net-revenue/waterfall.handler";
import { Dataset } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { getBrandImage } from "@common/utils/images/brand-image.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";

describe("WaterfallHandler", () => {
  describe("handle", () => {
    it("should return empty array when defaultDataset is not provided", async () => {
      // Act
      const result = await waterfallHandler.handle([], undefined);

      // Assert
      expect(result).toEqual([]);
    });

    it("should return empty array when defaultDataset data is empty", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await waterfallHandler.handle([], mockDataset);

      // Assert
      expect(result).toEqual([]);
    });

    it("should preserve the legacy BFF contract for dedicated NR function rows", async () => {
      const nrFunctionRows = [
        new KpiEntity({
          waterfall_filter: "portfolio",
          portfolio: "",
          country_iso_code_3: "ABI",
          dt_end: "2025-06-01",
          step_name: "YTD'25",
          ac: 1000,
          ac_vs_ly: 0,
          nr_per_hl_vs_ly: 0,
          vol_vs_ly: 0,
          unit_of_measure: "$Mio",
          comp_unit_of_measure: "%",
        }),
        new KpiEntity({
          waterfall_filter: "portfolio",
          portfolio: "Megabrands",
          country_iso_code_3: "",
          dt_end: "2026-06-01",
          step_name: "Megabrands",
          ac: 120,
          ac_vs_ly: 4.8,
          nr_per_hl_vs_ly: 2.5,
          vol_vs_ly: 1.2,
          unit_of_measure: "$Mio",
          comp_unit_of_measure: "%",
        }),
        new KpiEntity({
          waterfall_filter: "portfolio",
          portfolio: "",
          country_iso_code_3: "ABI",
          dt_end: "2026-06-01",
          step_name: "YTD'26",
          ac: 1120,
          ac_vs_ly: 12,
          nr_per_hl_vs_ly: 2.5,
          vol_vs_ly: 1.2,
          unit_of_measure: "$Mio",
          comp_unit_of_measure: "%",
        }),
      ];
      const dataset: Dataset = {
        id: "performance_tool_finance_nr_waterfall",
        data: nrFunctionRows,
      };

      const result = await waterfallHandler.handle([], dataset);

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        period: "YTD'25",
        label_value: "",
        waterfall_filter: "portfolio",
        ac: 1000,
        ac_delta: 1000,
        nr_vs_ly: 0,
        vol_vs_ly: 0,
      });
      expect(result[1]).toMatchObject({
        period: "Megabrands",
        label_value: "Megabrands",
        ac_delta: 4.8,
        nr_vs_ly: 2.5,
        nr_vs_ly_direction: "up",
        vol_vs_ly: 1.2,
        vol_vs_ly_direction: "up",
      });
      expect(result[2]).toMatchObject({
        period: "YTD'26",
        label_value: "",
        ac: 1120,
        ac_delta: 1120,
      });
    });

    it("should process dataset data correctly with all filter types", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            waterfall_filter: "brand",
            raw_brand: "Brahma",
            country_iso_code_3: "BRA",
            dt_end: "2023-12-31",
            step_name: "Q4",
            ac: 1200.5,
            ac_vs_ly: 4.8,
            nr_per_hl_vs_ly: 2.5,
            vol_vs_ly: 1.2,
            unit_of_measure: "%",
            comp_unit_of_measure: "%",
          },
          {
            waterfall_filter: "portfolio",
            portfolio: "Premium Portfolio",
            country_iso_code_3: "USA",
            dt_end: "2023-06-30",
            step_name: "Q2",
            ac: 500.25,
            ac_vs_ly: -2.3,
            nr_per_hl_vs_ly: -1.5,
            vol_vs_ly: -0.8,
          },
          {
            waterfall_filter: "country",
            country_iso_code_3: "GBR",
            dt_end: "2023-09-30",
            step_name: "Q3",
            ac: 750.0,
            ac_vs_ly: 3.2,
            nr_per_hl_vs_ly: 1.8,
            vol_vs_ly: 0.5,
          },
        ],
      };

      // Act
      const result = await waterfallHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(3);

      // Brand filter
      expect(result[0]).toMatchObject({
        label_value: ["Brahma"],
        waterfall_filter: "brand",
        ac: 1200.5,
        ac_delta: 1200.5, // First item uses ac
        ac_direction: "up",
        ac_delta_direction: "up",
        ac_vs_ly_direction: "up",
      });

      // Portfolio filter - middle item uses ac_vs_ly for ac_delta
      // Middle item has badgeFlag, so label_value is an array
      expect(result[1]).toMatchObject({
        label_value: ["Premium Portfolio", "USA"],
        waterfall_filter: "portfolio",
        ac_delta: -2.3, // Middle item uses ac_vs_ly
        ac_vs_ly_direction: "down",
      });

      // Country filter - last item uses ac for ac_delta
      expect(result[2]).toMatchObject({
        label_value: "GBR",
        waterfall_filter: "country",
        ac_delta: 750.0, // Last item uses ac
        ac_vs_ly_direction: "up",
      });
    });

    it("should handle badgeFlag correctly for middle items", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            waterfall_filter: "brand",
            raw_brand: "Brahma",
            country_iso_code_3: "BRA",
            dt_end: "2023-03-31",
            step_name: "Q1",
            ac: 1000,
            ac_vs_ly: 3.5,
            nr_per_hl_vs_ly: 2.0,
            vol_vs_ly: 1.0,
          },
          {
            waterfall_filter: "brand",
            raw_brand: "Skol",
            country_iso_code_3: "USA",
            dt_end: "2023-06-30",
            step_name: "Q2",
            ac: 800,
            ac_vs_ly: -1.2,
            nr_per_hl_vs_ly: -0.5,
            vol_vs_ly: -0.3,
          },
          {
            waterfall_filter: "brand",
            raw_brand: "Antarctica",
            country_iso_code_3: "GBR",
            dt_end: "2023-09-30",
            step_name: "Q3",
            ac: 600,
            ac_vs_ly: 2.0,
            nr_per_hl_vs_ly: 1.0,
            vol_vs_ly: 0.5,
          },
        ],
      };

      // Act
      const result = await waterfallHandler.handle([], mockDataset);

      // Assert
      // First and last items should not have badgeFlag
      expect(result[0].badgeFlag).toBeUndefined();
      expect(result[2].badgeFlag).toBeUndefined();

      // Brand filter always returns array for label_value
      expect(result[0].label_value).toEqual(["Brahma"]);
      expect(result[2].label_value).toEqual(["Antarctica"]);

      // Middle item should have badgeFlag
      expect(result[1].badgeFlag).toBeDefined();
      const badgeFlag = result[1].badgeFlag as
        | { src: string; alt: string }
        | undefined;
      if (badgeFlag) {
        expect(badgeFlag.alt).toBe("USA");
        expect(badgeFlag.src).toBeTruthy();
      }

      // When badgeFlag exists, label_value should be [labelValue, country_iso_code_3]
      expect(result[1].label_value).toEqual(["Skol", "USA"]);
    });

    it("should use brand image on total pillars when waterfall_filter is sub_brand", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            waterfall_filter: "sub_brand",
            raw_brand: "Brahma",
            country_iso_code_3: "BRA",
            dt_end: "2025-06-01",
            step_name: "YTD'25",
            ac: 882.5,
            ac_vs_ly: -5.2,
            nr_per_hl_vs_ly: 1.9,
            vol_vs_ly: -6.9,
          },
          {
            waterfall_filter: "sub_brand",
            raw_brand: "",
            country_iso_code_3: "BRA",
            dt_end: "2026-06-01",
            step_name: "Chopp Brahma",
            ac: 5.2,
            ac_vs_ly: 10.7,
            nr_per_hl_vs_ly: 6.0,
            vol_vs_ly: 4.4,
          },
          {
            waterfall_filter: "sub_brand",
            raw_brand: "Brahma",
            country_iso_code_3: "BRA",
            dt_end: "2026-06-01",
            step_name: "YTD'26",
            ac: 1002.7,
            ac_vs_ly: 1.2,
            nr_per_hl_vs_ly: 3.0,
            vol_vs_ly: -1.8,
          },
        ],
      };

      const result = await waterfallHandler.handle([], mockDataset);
      const expectedBrandImage = getBrandImage("Brahma", { format: "square" });
      const countryFlagImage = getCountryFlag("BRA");

      expect(result).toHaveLength(3);
      expect(result[0].image_value).toBe(expectedBrandImage);
      expect(result[0].image_value).not.toBe(countryFlagImage);
      expect(result[1].image_value).toBe("");
      expect(result[2].image_value).toBe(expectedBrandImage);
      expect(result[2].image_value).not.toBe(countryFlagImage);
    });

    it("should return undefined badgeFlag for 'Others' or 'ABI' country code", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            waterfall_filter: "brand",
            raw_brand: "Brahma",
            country_iso_code_3: "BRA",
            dt_end: "2023-03-31",
            step_name: "Q1",
            ac: 1000,
            ac_vs_ly: 3.5,
            nr_per_hl_vs_ly: 2.0,
            vol_vs_ly: 1.0,
          },
          {
            waterfall_filter: "brand",
            raw_brand: "Others",
            country_iso_code_3: "USA",
            dt_end: "2023-06-30",
            step_name: "Others",
            ac: 800,
            ac_vs_ly: -1.2,
            nr_per_hl_vs_ly: -0.5,
            vol_vs_ly: -0.3,
          },
          {
            waterfall_filter: "brand",
            raw_brand: "Skol",
            country_iso_code_3: "ABI",
            dt_end: "2023-09-30",
            step_name: "Q3",
            ac: 600,
            ac_vs_ly: 2.0,
            nr_per_hl_vs_ly: 1.0,
            vol_vs_ly: 0.5,
          },
        ],
      };

      // Act
      const result = await waterfallHandler.handle([], mockDataset);

      // Assert
      // Brand filter always returns array for label_value
      expect(result[0].label_value).toEqual(["Brahma"]);
      expect(result[1].label_value).toEqual(["Others"]); // Others without badgeFlag
      expect(result[2].label_value).toEqual(["Skol"]); // ABI without badgeFlag

      expect(result[1].badgeFlag).toBeUndefined(); // Others
      expect(result[2].badgeFlag).toBeUndefined(); // ABI
    });
  });
});
