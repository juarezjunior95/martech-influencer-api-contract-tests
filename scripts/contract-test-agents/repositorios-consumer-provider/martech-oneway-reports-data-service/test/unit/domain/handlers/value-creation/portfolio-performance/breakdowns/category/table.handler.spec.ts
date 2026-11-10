import { breakdownsCategoryTableHandler } from "@domain/handlers/value-creation/portfolio-performance/breakdowns/category/table.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("BreakdownsCategoryTableHandler", () => {
  describe("handler", () => {
    it("should map the segments statement (PRICE_TIER) to snake_case contract", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            PRICE_TIER: "Core Superiority",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01",
            VERSION_ID: 46,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            AC_VS_LY: 3.5,
            LY: 95.3,
            ORDER_VALUE: -100.5,
            INDEX_VALUE: 105.2,
          },
        ],
      };

      const result = await breakdownsCategoryTableHandler.handle(
        [],
        mockDataset,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        period_type: "YTD",
        dt_ini: "2025-01-01",
        dt_end: "2025-10-01",
        segment: "Core Superiority",
        price_tier: "Core Superiority",
        zone: "NAZ",
        country: "USA",
        version_id: 46,
        kpi_name: "volume",
        og_vs_ly: 5.2,
        comp_og_vs_ly_direction: "up",
        ac: 100.5,
        ac_vs_ly: 3.5,
        comp_ac_vs_ly_direction: "up",
        ly: 95.3,
        order_value: -100.5,
        index_value: 105.2,
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
            DT_END: "2025-10-01",
            VERSION_ID: 46,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            AC_VS_LY: 3.5,
            LY: 95.3,
            ORDER_VALUE: -100.5,
            INDEX_VALUE: 105.2,
          },
        ],
      };

      const result = await breakdownsCategoryTableHandler.handle(
        [],
        mockDataset,
      );

      expect(result[0].segment).toBe("NAB");
      expect(result[0].price_tier).toBe("NAB");
    });

    it("should map the portfolio statement (SEGMENT) to snake_case contract", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            SEGMENT: "Beer",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01",
            VERSION_ID: 53,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            AC_VS_LY: 3.5,
            LY: 95.3,
            ORDER_VALUE: -100.5,
            INDEX_VALUE: 105.2,
          },
        ],
      };

      const result = await breakdownsCategoryTableHandler.handle(
        [],
        mockDataset,
      );

      expect(result[0].segment).toBe("Beer");
      expect(result[0].price_tier).toBeUndefined();
    });

    it("should translate negative variations into the down direction", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "EUR",
            COUNTRY_ISO_CODE_3: "GBR",
            SEGMENT: "Beer",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01",
            VERSION_ID: 2,
            KPI_NAME: "nr",
            OG_VS_LY: -2.5,
            AC: 80.3,
            AC_VS_LY: -1.8,
            LY: 82.8,
            ORDER_VALUE: 1,
            INDEX_VALUE: 97.0,
          },
        ],
      };

      const result = await breakdownsCategoryTableHandler.handle(
        [],
        mockDataset,
      );

      expect(result[0].comp_og_vs_ly_direction).toBe("down");
      expect(result[0].comp_ac_vs_ly_direction).toBe("down");
    });

    it("should return empty array when dataset is missing", async () => {
      expect(await breakdownsCategoryTableHandler.handle([])).toEqual([]);
      expect(
        await breakdownsCategoryTableHandler.handle([], {
          id: "x",
          data: [],
        }),
      ).toEqual([]);
    });
  });
});
