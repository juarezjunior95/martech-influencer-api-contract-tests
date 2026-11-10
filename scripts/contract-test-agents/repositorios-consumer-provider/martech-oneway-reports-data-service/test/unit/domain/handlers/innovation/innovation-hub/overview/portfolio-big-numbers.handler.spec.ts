import { portfolioBigNumbersHandler } from "@domain/handlers/innovation/innovation-hub/overview/portfolio-big-numbers.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("PortfolioBigNumbersHandler", () => {
  describe("handle", () => {
    it("should map lake columns to formatter contract", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-big-numbers",
        data: [
          {
            KPI_NAME: "active_inno_skus",
            AC: 142,
            AC_VS_LY: 3.6,
            VARIATION_DIRECTION_VS_LY: "up",
            REFRESH_MONTH_LABEL: "May'26",
            PERIOD_TYPE: "YTD",
            UNIT_OF_MEASURE: "#",
            COMP_UNIT_OF_MEASURE: "%",
            COUNTRY_ISO_CODE_3: "ABI",
            ABI_ZONE: "ABI",
          },
        ],
      };

      const result = await portfolioBigNumbersHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        kpi_name: "active_inno_skus",
        ac: 142,
        ac_vs_ly: 3.6,
        variationDirectionVsLy: "up",
        refreshMonthLabel: "May'26",
        label_period: undefined,
        period_type: "YTD",
        unit_of_measure: "#",
        comp_unit_of_measure: "%",
        country: "ABI",
        zone: "ABI",
      });
    });

    it("should handle snake_case lake columns", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-big-numbers",
        data: [
          {
            kpi_name: "sku_avg_size",
            ac: 4.2,
            ac_vs_ly: -0.8,
            variation_direction_vs_ly: "down",
            refresh_month_label: "May'26",
            period_type: "YTD",
            unit_of_measure: "hl/SKU",
            comp_unit_of_measure: "%",
            country_iso_code_3: "BRA",
            abi_zone: "SAZ",
          },
        ],
      };

      const result = await portfolioBigNumbersHandler.handle([], mockDataset);

      expect(result[0].kpi_name).toBe("sku_avg_size");
      expect(result[0].ac).toBe(4.2);
      expect(result[0].ac_vs_ly).toBe(-0.8);
      expect(result[0].variationDirectionVsLy).toBe("down");
      expect(result[0].country).toBe("BRA");
      expect(result[0].zone).toBe("SAZ");
    });

    it("should normalize ALL country and zone to ABI in output", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-big-numbers",
        data: [
          {
            KPI_NAME: "active_inno_skus",
            AC: 100,
            COUNTRY_ISO_CODE_3: "ALL",
            ABI_ZONE: "ALL",
          },
        ],
      };

      const result = await portfolioBigNumbersHandler.handle([], mockDataset);

      expect(result[0].country).toBe("ABI");
      expect(result[0].zone).toBe("ABI");
    });

    it("should map lake TVF columns KPI, VALUE, VS_LY and PERIOD", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-big-numbers",
        data: [
          {
            CARD: 1,
            COUNTRY: "ABI",
            PERIOD: "YTD",
            DT_END: "2026-06-01",
            KPI: "Active Inno SKUs",
            VALUE: 857,
            UNIT_OF_MEASURE: "#",
            VS_LY: -15.7,
            COMP_UNIT_OF_MEASURE: "%",
          },
          {
            CARD: 2,
            COUNTRY: "ABI",
            PERIOD: "YTD",
            DT_END: "2026-06-01",
            KPI: "SKU average size",
            VALUE: 59.6,
            UNIT_OF_MEASURE: "hl/SKU",
            VS_LY: 21.7,
            COMP_UNIT_OF_MEASURE: "%",
          },
        ],
      };

      const result = await portfolioBigNumbersHandler.handle([], mockDataset);

      expect(result[0]).toMatchObject({
        kpi_name: "Active Inno SKUs",
        ac: 857,
        ac_vs_ly: -15.7,
        variationDirectionVsLy: "down",
        period_type: "YTD",
        unit_of_measure: "#",
        comp_unit_of_measure: "%",
        country: "ABI",
      });
      expect(result[1]).toMatchObject({
        kpi_name: "SKU average size",
        ac: 59.6,
        ac_vs_ly: 21.7,
        variationDirectionVsLy: "up",
        period_type: "YTD",
        unit_of_measure: "hl/SKU",
      });
    });

    it("should handle lake display labels for kpi_name", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-big-numbers",
        data: [
          {
            KPI_NAME: "Active Inno SKUs",
            AC: 142,
            AC_VS_LY: 3.6,
            VARIATION_DIRECTION_VS_LY: "up",
            REFRESH_MONTH_LABEL: "Jun'26",
            UNIT_OF_MEASURE: "#",
            COMP_UNIT_OF_MEASURE: "%",
            COUNTRY_ISO_CODE_3: "ABI",
          },
        ],
      };

      const result = await portfolioBigNumbersHandler.handle([], mockDataset);

      expect(result[0].kpi_name).toBe("Active Inno SKUs");
      expect(result[0].ac).toBe(142);
      expect(result[0].ac_vs_ly).toBe(3.6);
    });

    it("should return empty array when dataset is missing", async () => {
      const result = await portfolioBigNumbersHandler.handle([], undefined);

      expect(result).toEqual([]);
    });

    it("should return empty array when dataset has no data", async () => {
      const mockDataset: Dataset = {
        id: "portfolio-big-numbers",
        data: [],
      };

      const result = await portfolioBigNumbersHandler.handle([], mockDataset);

      expect(result).toEqual([]);
    });
  });
});
