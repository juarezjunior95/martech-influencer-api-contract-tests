import {
  ageGroupsFilterHandler,
  genderFilterHandler,
  incomeGroupsFilterHandler,
  type DemographicFilterPresetValue,
} from "@domain/config/presets/cohorts/demographics-filter.handler";

describe("DemographicsFilterPresetHandler", () => {
  it("emits gender values with All as default", () => {
    const result = genderFilterHandler.handle({ gender: {} });
    const genders = result.genders as DemographicFilterPresetValue;

    expect(genders.enabled).toBe(true);
    expect(genders.default).toEqual({ value: "All", label: "All", full: "" });
    expect(genders.values.map((v) => v.value)).toEqual([
      "All",
      "Male",
      "Female",
    ]);
  });

  it("emits age band value and label for LDA row", () => {
    const result = ageGroupsFilterHandler.handle({ "age-groups": {} });
    const age = result["age-groups"] as DemographicFilterPresetValue;

    expect(age.values[1]).toEqual({
      value: "LDA - 24",
      label: "LDA-24",
      full: "",
    });
  });

  it("emits income tier labels after All", () => {
    const result = incomeGroupsFilterHandler.handle({ "income-groups": {} });
    const inc = result["income-groups"] as DemographicFilterPresetValue;

    expect(inc.values.map((v) => v.label)).toEqual([
      "All",
      "High Income",
      "Medium Income",
      "Low Income",
    ]);
  });
});
