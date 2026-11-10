import { cohortsHandler } from "@domain/config/presets/cohorts/cohorts.handler";
import type { CohortsPresetValue } from "@domain/config/presets/cohorts/cohorts.handler";
import { getAllAgeGroupTuples } from "@domain/config/presets/cohorts/demographic-options.model";

describe("CohortsPresetHandler", () => {
  it("groups Gender, Age, and Income without the All row", () => {
    const result = cohortsHandler.handle({ cohorts: {} });
    const cohorts = result.cohorts as CohortsPresetValue;

    expect(cohorts.enabled).toBe(true);
    expect(cohorts.default).toEqual([]);
    expect(cohorts.values.map((b) => b.group)).toEqual([
      "Gender",
      "Age",
      "Income",
    ]);

    expect(cohorts.values[0].values.map((v) => v.value)).toEqual([
      "Male",
      "Female",
    ]);

    expect(cohorts.values[1].values[0]).toEqual(
      getAllAgeGroupTuples()[1] as {
        value: string;
        label: string;
        full: string;
      },
    );

    expect(cohorts.values[2].values.map((v) => v.value)).toEqual([
      "High Income",
      "Medium Income",
      "Low Income",
    ]);
  });
});
