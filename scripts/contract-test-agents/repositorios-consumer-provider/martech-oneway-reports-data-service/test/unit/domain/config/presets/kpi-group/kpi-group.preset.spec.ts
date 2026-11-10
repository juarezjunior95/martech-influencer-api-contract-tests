import { Dataset } from "@domain/entities/common/base-config.entity";
import { PresetDefinition } from "@domain/entities/preset.entity";
import kpiGroupConfig from "@domain/config/presets/kpi-group/kpi-group.preset";
import { kpiGroupHandler } from "@domain/config/presets/kpi-group/kpi-group.handler";
import {
  KPI_GROUP_DATASET_ID,
  KpiGroupFilterItem,
} from "@domain/config/presets/kpi-group/kpi-group.types";

function buildDataset(
  rows: { kpi_name: string; time_frame: string }[],
): Dataset {
  return {
    id: KPI_GROUP_DATASET_ID,
    data: rows.map((row) => ({
      kpi_name: row.kpi_name,
      time_frame: row.time_frame,
    })),
  };
}

function buildPreset(): PresetDefinition {
  return {
    kpiGroup: { type: "kpi-group", source: "databricks" } as KpiGroupFilterItem,
  };
}

describe("kpi-group preset", () => {
  it("wires the query-backed handler with the expected version", () => {
    expect(kpiGroupConfig.version).toBe("1.0.0");
    expect(kpiGroupConfig.handler).toBe(kpiGroupHandler);
  });

  it("declares the kpi-group dataset", () => {
    const datasets = kpiGroupHandler.datasets?.() ?? [];
    expect(datasets).toHaveLength(1);
    expect(datasets[0].id).toBe(KPI_GROUP_DATASET_ID);
  });
});

describe("kpiGroupHandler", () => {
  it("returns an empty response when the dataset has no rows", () => {
    const result = kpiGroupHandler.handle(buildPreset(), [buildDataset([])]);
    expect(result).toEqual({});
  });

  it("passes string time_frame values through verbatim", () => {
    const result = kpiGroupHandler.handle(buildPreset(), [
      buildDataset([
        { kpi_name: "volume", time_frame: "2026-04-01" },
        { kpi_name: "finance", time_frame: "01-03-2026" },
        {
          kpi_name: "category-health",
          time_frame: "whatever-the-query-returns",
        },
      ]),
    ]);

    expect(result).toEqual({
      volume: "2026-04-01",
      finance: "01-03-2026",
      "category-health": "whatever-the-query-returns",
    });
  });

  it("coerces category_health_full_years_* values back to numbers", () => {
    const result = kpiGroupHandler.handle(buildPreset(), [
      buildDataset([
        { kpi_name: "category_health_full_years_start", time_frame: "2015" },
        { kpi_name: "category_health_full_years_end", time_frame: "2025" },
        { kpi_name: "volume", time_frame: "2026-04-01" },
      ]),
    ]);

    expect(result).toEqual({
      category_health_full_years_start: 2015,
      category_health_full_years_end: 2025,
      volume: "2026-04-01",
    });
  });

  it("accepts upper-case column aliases (KPI_NAME / TIME_FRAME)", () => {
    const dataset: Dataset = {
      id: KPI_GROUP_DATASET_ID,
      data: [
        { KPI_NAME: "volume", TIME_FRAME: "2026-04-01" },
        { KPI_NAME: "growth_league", TIME_FRAME: "2025-11-01" },
      ],
    };

    expect(kpiGroupHandler.handle(buildPreset(), [dataset])).toEqual({
      volume: "2026-04-01",
      growth_league: "2025-11-01",
    });
  });

  it("drops the kpi-group marker entry from the response", () => {
    const result = kpiGroupHandler.handle(buildPreset(), [
      buildDataset([{ kpi_name: "volume", time_frame: "2026-04-01" }]),
    ]);

    expect(result).not.toHaveProperty("kpiGroup");
  });

  it("passes through preset keys that are not KpiGroupFilterItems", () => {
    const preset: PresetDefinition = {
      ...buildPreset(),
      static_passthrough: "stays",
    };

    const result = kpiGroupHandler.handle(preset, [
      buildDataset([{ kpi_name: "volume", time_frame: "2026-04-01" }]),
    ]);

    expect(result.static_passthrough).toBe("stays");
    expect(result.volume).toBe("2026-04-01");
  });

  it("skips rows missing kpi_name or time_frame", () => {
    const dataset: Dataset = {
      id: KPI_GROUP_DATASET_ID,
      data: [
        { kpi_name: "", time_frame: "2026-04-01" },
        { kpi_name: "volume" },
        { kpi_name: "finance", time_frame: "2026-03-01" },
      ],
    };

    expect(kpiGroupHandler.handle(buildPreset(), [dataset])).toEqual({
      finance: "2026-03-01",
    });
  });

  it("treats a missing dataset as an empty result (no throw)", () => {
    expect(kpiGroupHandler.handle(buildPreset(), [])).toEqual({});
    expect(kpiGroupHandler.handle(buildPreset())).toEqual({});
  });
});
