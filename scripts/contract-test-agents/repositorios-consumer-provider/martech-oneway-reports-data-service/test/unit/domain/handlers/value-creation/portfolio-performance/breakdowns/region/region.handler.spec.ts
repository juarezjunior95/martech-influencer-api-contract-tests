import { KpiEntity } from "@domain/entities/kpi.entity";
import { Dataset } from "@domain/entities/datasource.entity";
import { regionHandler } from "@domain/handlers/value-creation/portfolio-performance/breakdowns/region/region.handler";

describe("RegionHandler", () => {
  it("should map the unified region query row using KpiEntity computed fields", async () => {
    const mockDataset: Dataset = {
      id: "breakdowns-region",
      data: [
        new KpiEntity({
          type: "nr",
          dt_ini: "2025-10-01",
          dt_end: "2025-10-01T00:00:00.000Z",
          region: "USA",
          country_name: "United States",
          ac: 100.5,
          ly: 95.3,
          ac_vs_ly: 3.5,
          delta: 5.2,
          kpi_ac_per_hl: 10.1,
          kpi_og_ly_per_hl: null,
          weight: 25.2,
          index: 1.05,
          rnk: 1,
          type_order: "kpi_per",
        }),
      ],
    };

    const result = await regionHandler.handle([], mockDataset);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      type: "nr",
      type_order: "kpi_per",
      period_type: null,
      dt_ini: "2025-10-01",
      dt_end: "2025-10-01T00:00:00.000Z",
      region: "USA",
      country: "USA",
      country_name: "United States",
      kpi_name: "nr",
      ac: 100.5,
      ly: 95.3,
      ac_vs_ly: 3.5,
      comp_ac_vs_ly_direction: "up",
      og_vs_ly: 5.2,
      value: 5.2,
      comp_og_vs_ly_direction: "up",
      kpi_ac_per_hl: 10.1,
      kpi_og_ly_per_hl: null,
      weight: 25.2,
      index: 1.05,
      rank: 1,
      current_month_label: "Oct'25",
      ly_month_label: "Oct'24",
    });
  });

  it("should normalize volume-only rows and accept uppercase aliases", async () => {
    const mockDataset: Dataset = {
      id: "breakdowns-region",
      data: [
        {
          TYPE: "VOLUME ONLY",
          DT_INI: "2025-01-01",
          DT_END: "2025-10-01",
          REGION: "MAZ",
          COUNTRY_NAME: "MAZ",
          AC: 100,
          LY: 90,
          AC_VS_LY: 11.1,
          DELTA: 10,
          INDEX: 1.2,
          RNK: 2,
          TYPE_ORDER: "vol",
        },
      ],
    };

    const result = await regionHandler.handle([], mockDataset);

    expect(result[0].kpi_name).toBe("volume");
    expect(result[0].region).toBe("MAZ");
    expect(result[0].country).toBe("MAZ");
    expect(result[0].country_name).toBe("MAZ");
    expect(result[0].index).toBe(1.2);
  });

  it("should return empty array when dataset is missing", async () => {
    expect(await regionHandler.handle([])).toEqual([]);
    expect(
      await regionHandler.handle([], {
        id: "x",
        data: undefined,
      }),
    ).toEqual([]);
  });
});
