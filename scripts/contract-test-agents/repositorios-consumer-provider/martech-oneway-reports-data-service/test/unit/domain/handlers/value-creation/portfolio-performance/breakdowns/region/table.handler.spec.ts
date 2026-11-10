import { regionTableHandler } from "@domain/handlers/value-creation/portfolio-performance/breakdowns/region/table.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("RegionTableHandler", () => {
  describe("handler", () => {
    it("should map every Drupal statement column to the snake_case contract", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "NAZ",
            COUNTRY_ISO_CODE_3: "USA",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01",
            VERSION_ID: 2,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            AC_VS_LY: 3.5,
            LY: 95.3,
            ORDER_VALUE: "1",
            INDEX_VALUE: 105.2,
          },
        ],
      };

      const result = await regionTableHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        period_type: "YTD",
        dt_ini: "2025-01-01",
        dt_end: "2025-10-01",
        zone: "NAZ",
        country: "USA",
        version_id: 2,
        kpi_name: "volume",
        og_vs_ly: 5.2,
        comp_og_vs_ly_direction: "up",
        ac: 100.5,
        ac_vs_ly: 3.5,
        comp_ac_vs_ly_direction: "up",
        ly: 95.3,
        order_value: "1",
        index_value: 105.2,
      });
    });

    it("should translate negative variations into the down direction", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "EUR",
            COUNTRY_ISO_CODE_3: "GBR",
            DT_INI: "2025-01-01",
            DT_END: "2025-09-01",
            VERSION_ID: 2,
            KPI_NAME: "nr",
            OG_VS_LY: -2.5,
            AC: 80.3,
            AC_VS_LY: -1.8,
            LY: 82.8,
            ORDER_VALUE: "2",
            INDEX_VALUE: 97.0,
          },
        ],
      };

      const result = await regionTableHandler.handle([], mockDataset);

      expect(result[0].comp_og_vs_ly_direction).toBe("down");
      expect(result[0].comp_ac_vs_ly_direction).toBe("down");
    });

    it("should return an empty array when the dataset has no rows", async () => {
      const mockDataset: Dataset = { id: "test-dataset", data: [] };
      const result = await regionTableHandler.handle([], mockDataset);
      expect(result).toEqual([]);
    });

    it("should return an empty array when no default dataset is provided", async () => {
      const result = await regionTableHandler.handle([]);
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
            DT_END: "2025-10-01",
            VERSION_ID: 2,
            KPI_NAME: "volume",
            OG_VS_LY: 5.2,
            AC: 100.5,
            AC_VS_LY: 3.5,
            LY: 95.3,
            ORDER_VALUE: "1",
            INDEX_VALUE: 105.2,
          },
          {
            PERIOD_TYPE: "YTD",
            ABI_ZONE: "SAZ",
            COUNTRY_ISO_CODE_3: "BRA",
            DT_INI: "2025-01-01",
            DT_END: "2025-10-01",
            VERSION_ID: 2,
            KPI_NAME: "volume",
            OG_VS_LY: -1.5,
            AC: 250.8,
            AC_VS_LY: 2.0,
            LY: 252.3,
            ORDER_VALUE: "2",
            INDEX_VALUE: 99.4,
          },
        ],
      };

      const result = await regionTableHandler.handle([], mockDataset);

      expect(result).toHaveLength(2);
      expect(result[0].zone).toBe("NAZ");
      expect(result[1].zone).toBe("SAZ");
      expect(result[0].comp_og_vs_ly_direction).toBe("up");
      expect(result[1].comp_og_vs_ly_direction).toBe("down");
    });
  });
});
