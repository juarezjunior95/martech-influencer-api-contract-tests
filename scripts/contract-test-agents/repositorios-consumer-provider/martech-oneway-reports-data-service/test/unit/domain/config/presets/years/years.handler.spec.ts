import {
  yearsHandler,
  YearPresetValue,
} from "@domain/config/presets/years/years.handler";
import { KPI_GROUP_DATASET_ID } from "@domain/config/presets/kpi-group/kpi-group.types";
import { Dataset } from "@domain/entities/common/base-config.entity";

describe("yearsHandler", () => {
  it("emits newest-first FY-formatted year tuples between the configured range", () => {
    const result = yearsHandler.handle({
      years: { startYear: 2022, endYear: 2025 },
    });
    const years = result.years as YearPresetValue;

    expect(years.enabled).toBe(true);
    expect(years.values).toEqual([
      { value: "2025", label: "FY'25", full: "Full Year (FY)" },
      { value: "2024", label: "FY'24", full: "Full Year (FY)" },
      { value: "2023", label: "FY'23", full: "Full Year (FY)" },
      { value: "2022", label: "FY'22", full: "Full Year (FY)" },
    ]);
    expect(years.default).toEqual({
      value: "2025",
      label: "FY'25",
      full: "Full Year (FY)",
    });
  });

  it("collapses default to {} when preset.years.noDefault=true", () => {
    const result = yearsHandler.handle({
      years: { noDefault: true, startYear: 2024, endYear: 2025 },
    });
    const years = result.years as YearPresetValue;

    expect(years.default).toEqual({});
    expect(years.values).toHaveLength(2);
  });

  it("uses category_health year bounds from kpi-group dataset when preset omits start/end", () => {
    const datasets: Dataset[] = [
      {
        id: KPI_GROUP_DATASET_ID,
        data: [
          {
            kpi_name: "category_health_full_years_start",
            time_frame: "2025",
          },
          {
            kpi_name: "category_health_full_years_end",
            time_frame: "2021",
          },
        ],
      },
    ];
    const result = yearsHandler.handle({ years: {} }, datasets);
    const years = result.years as YearPresetValue;

    expect(years.values).toEqual([
      { value: "2025", label: "FY'25", full: "Full Year (FY)" },
      { value: "2024", label: "FY'24", full: "Full Year (FY)" },
      { value: "2023", label: "FY'23", full: "Full Year (FY)" },
      { value: "2022", label: "FY'22", full: "Full Year (FY)" },
      { value: "2021", label: "FY'21", full: "Full Year (FY)" },
    ]);
  });
});
