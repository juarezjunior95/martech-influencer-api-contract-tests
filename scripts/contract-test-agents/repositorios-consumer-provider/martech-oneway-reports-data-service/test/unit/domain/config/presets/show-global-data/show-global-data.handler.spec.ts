import { DataItem, Dataset } from "@domain/entities/common/base-config.entity";
import { PresetDefinition } from "@domain/entities/preset.entity";
import { showGlobalDataHandler } from "@domain/config/presets/show-global-data/show-global-data.handler";
import {
  SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION,
  SHOW_GLOBAL_DATA_SUBJECTS,
  showGlobalDatasetIdForSubject,
} from "@domain/config/presets/show-global-data/show-global-data.types";
import type { ShowGlobalDataPresetValue } from "@domain/config/presets/show-global-data/show-global-data.types";

function buildDataset(subject: "pos" | "power", rows: DataItem[]): Dataset {
  return {
    id: showGlobalDatasetIdForSubject(subject),
    data: rows,
  };
}

describe("showGlobalDataHandler", () => {
  it("declares one Databricks dataset per subject (pos, power)", () => {
    const datasets = showGlobalDataHandler.datasets();
    expect(datasets).toHaveLength(2);
    expect(datasets.map((d) => d.id)).toEqual([
      showGlobalDatasetIdForSubject("pos"),
      showGlobalDatasetIdForSubject("power"),
    ]);
    for (const subject of SHOW_GLOBAL_DATA_SUBJECTS) {
      const ds = datasets.find(
        (d) => d.id === showGlobalDatasetIdForSubject(subject),
      );
      expect(ds?.config.procedure).toContain(
        SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION,
      );
      expect(ds?.config.procedure).toContain(`"subject": "${subject}"`);
    }
  });

  it("returns hasGlobalData false when both datasets are empty", () => {
    const preset: PresetDefinition = { show_global_data: {} };
    const result = showGlobalDataHandler.handle(preset, [
      buildDataset("pos", []),
      buildDataset("power", []),
    ]) as { show_global_data: ShowGlobalDataPresetValue };

    expect(result.show_global_data).toEqual({
      values: [
        { kpi: "pos", hasGlobalData: false },
        { kpi: "power", hasGlobalData: false },
      ],
    });
  });

  it("reads flag_uat per subject when NODE_ENV is uat", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "uat";
    const preset: PresetDefinition = { show_global_data: {} };

    try {
      const result = showGlobalDataHandler.handle(preset, [
        buildDataset("pos", [
          { group: "pos", flag_uat: "y", flag_prd: "n" } as DataItem,
        ]),
        buildDataset("power", [
          { group: "power", flag_uat: "n", flag_prd: "y" } as DataItem,
        ]),
      ]) as { show_global_data: ShowGlobalDataPresetValue };

      expect(result.show_global_data.values).toEqual([
        { kpi: "pos", hasGlobalData: true },
        { kpi: "power", hasGlobalData: false },
      ]);
    } finally {
      process.env.NODE_ENV = prev;
    }
  });

  it("reads flag_prd per subject when NODE_ENV is not uat", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const preset: PresetDefinition = { show_global_data: {} };

    try {
      const result = showGlobalDataHandler.handle(preset, [
        buildDataset("pos", [
          { group: "pos", flag_uat: "y", flag_prd: "n" } as DataItem,
        ]),
        buildDataset("power", [
          { group: "power", flag_uat: "n", flag_prd: "y" } as DataItem,
        ]),
      ]) as { show_global_data: ShowGlobalDataPresetValue };

      expect(result.show_global_data.values).toEqual([
        { kpi: "pos", hasGlobalData: false },
        { kpi: "power", hasGlobalData: true },
      ]);
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
