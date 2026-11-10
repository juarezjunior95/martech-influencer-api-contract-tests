import { breakdownsBrandsChartHandler } from "@domain/handlers/value-creation/portfolio-performance/breakdowns/brands/chart.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("BreakdownsBrandsChartHandler", () => {
  describe("handler", () => {
    it("should map the volume-only chart row to snake_case", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            RAW_BRAND: "Budweiser",
            SEGMENT: "Beer",
            PRICE_TIER: "Core Superiority",
            LEVEL_3: "1",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01T00:00:00.000Z",
            VERSION_ID: 138,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            LY: 95.3,
          },
        ],
      };

      const result = await breakdownsBrandsChartHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        period_type: "YTD",
        dt_ini: "2025-01-01",
        dt_end: "2025-10-01T00:00:00.000Z",
        raw_brand: "Budweiser",
        brand: "Budweiser",
        segment: "Beer",
        price_tier: "Core Superiority",
        level_3: "1",
        zone: "NAZ",
        country: "USA",
        version_id: 138,
        kpi_name: "volume",
        value: 5.2,
        ac: 100.5,
        ly: 95.3,
        current_month_label: "Oct'25",
        ly_month_label: "Oct'24",
      });
    });

    it("should preserve AS-IS the concatenated raw_brand returned by Drupal (global view)", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            RAW_BRAND: "USA | Budweiser",
            SEGMENT: "Beer",
            LEVEL_3: "1",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01T00:00:00.000Z",
            VERSION_ID: 51,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            LY: 95.3,
          },
        ],
      };

      const result = await breakdownsBrandsChartHandler.handle([], mockDataset);

      expect(result[0].raw_brand).toBe("USA | Budweiser");
      expect(result[0].brand).toBe("USA | Budweiser");
    });

    it("should keep NAB price tier unchanged (AS-IS from Drupal)", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            RAW_BRAND: "Budweiser Zero",
            PRICE_TIER: "NAB",
            LEVEL_3: "4",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01T00:00:00.000Z",
            VERSION_ID: 138,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            LY: 95.3,
          },
        ],
      };

      const result = await breakdownsBrandsChartHandler.handle([], mockDataset);

      expect(result[0].segment).toBe("NAB");
      expect(result[0].price_tier).toBe("NAB");
    });

    it("should return empty array when dataset is missing", async () => {
      expect(await breakdownsBrandsChartHandler.handle([])).toEqual([]);
      expect(
        await breakdownsBrandsChartHandler.handle([], {
          id: "x",
          data: undefined,
        }),
      ).toEqual([]);
    });
  });
});
