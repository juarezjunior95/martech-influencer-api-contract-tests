import { breakdownsCategoryChartHandler } from "@domain/handlers/value-creation/portfolio-performance/breakdowns/category/chart.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("BreakdownsCategoryChartHandler", () => {
  describe("handler", () => {
    it("should map the volume-only chart row (PRICE_TIER) to snake_case", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            PRICE_TIER: "Core Superiority",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01T00:00:00.000Z",
            VERSION_ID: 46,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            LY: 95.3,
            ORDER_VALUE: -100.5,
          },
        ],
      };

      const result = await breakdownsCategoryChartHandler.handle(
        [],
        mockDataset,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        period_type: "YTD",
        dt_ini: "2025-01-01",
        dt_end: "2025-10-01T00:00:00.000Z",
        segment: "Core Superiority",
        price_tier: "Core Superiority",
        zone: "NAZ",
        country: "USA",
        version_id: 46,
        kpi_name: "volume",
        value: 5.2,
        ac: 100.5,
        ly: 95.3,
        order_value: -100.5,
        current_month_label: "Oct'25",
        ly_month_label: "Oct'24",
      });
    });

    it("should keep NAB price tier unchanged (AS-IS from Drupal)", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            PRICE_TIER: "NAB",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01T00:00:00.000Z",
            VERSION_ID: 46,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            LY: 95.3,
          },
        ],
      };

      const result = await breakdownsCategoryChartHandler.handle(
        [],
        mockDataset,
      );

      expect(result[0].segment).toBe("NAB");
      expect(result[0].price_tier).toBe("NAB");
    });

    it("should map the portfolio statement (SEGMENT) correctly", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            SEGMENT: "Beer",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01T00:00:00.000Z",
            VERSION_ID: 53,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            LY: 95.3,
          },
        ],
      };

      const result = await breakdownsCategoryChartHandler.handle(
        [],
        mockDataset,
      );

      expect(result[0].segment).toBe("Beer");
      expect(result[0].price_tier).toBeUndefined();
    });

    it("should return empty array when dataset is missing", async () => {
      expect(await breakdownsCategoryChartHandler.handle([])).toEqual([]);
      expect(
        await breakdownsCategoryChartHandler.handle([], {
          id: "x",
          data: undefined,
        }),
      ).toEqual([]);
    });
  });
});
