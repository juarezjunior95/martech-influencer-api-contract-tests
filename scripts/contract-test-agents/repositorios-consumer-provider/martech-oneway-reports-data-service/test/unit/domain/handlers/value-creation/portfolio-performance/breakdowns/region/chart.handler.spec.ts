import { regionChartHandler } from "@domain/handlers/value-creation/portfolio-performance/breakdowns/region/chart.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("RegionChartHandler", () => {
  describe("handler", () => {
    it("should map volume-only chart row to snake_case contract", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01T00:00:00.000Z",
            LEVEL_3: "1",
            VERSION_ID: 2,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            LY: 95.3,
            ORDER_VALUE: "1",
          },
        ],
      };

      const result = await regionChartHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        period_type: "YTD",
        dt_ini: "2025-01-01",
        dt_end: "2025-10-01T00:00:00.000Z",
        zone: "NAZ",
        country: "USA",
        level_3: "1",
        version_id: 2,
        kpi_name: "volume",
        value: 5.2,
        ac: 100.5,
        ly: 95.3,
        order_value: "1",
        current_month_label: "Oct'25",
        ly_month_label: "Oct'24",
      });
    });

    it("should return empty array when dataset is undefined", async () => {
      const result = await regionChartHandler.handle([], undefined);
      expect(result).toEqual([]);
    });

    it("should return empty array when dataset data is undefined", async () => {
      const result = await regionChartHandler.handle([], {
        id: "test-dataset",
        data: undefined,
      });
      expect(result).toEqual([]);
    });

    it("should preserve multiple rows in order", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01T00:00:00.000Z",
            VERSION_ID: 2,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            LY: 95.3,
          },
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "EUR",
            COUNTRY_ISO_CODE_3: "GBR",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01T00:00:00.000Z",
            VERSION_ID: 2,
            KPI_NAME: "volume",
            OG_VS_LY: -1.8,
            AC: 45.2,
            LY: 47.0,
          },
        ],
      };

      const result = await regionChartHandler.handle([], mockDataset);

      expect(result).toHaveLength(2);
      expect(result[0].zone).toBe("NAZ");
      expect(result[1].zone).toBe("EUR");
      expect(result[1].value).toBe(-1.8);
    });
  });
});
