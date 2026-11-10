import {
  getPosToolDrilldownViewbyTuples,
  POS_TOOL_DRILLDOWN_VIEWBY_DEFINITIONS,
} from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown-viewby.model";

describe("getPosToolDrilldownViewbyTuples", () => {
  it("returns all 8 viewby options in the expected order", () => {
    const tuples = getPosToolDrilldownViewbyTuples();

    expect(tuples).toEqual(POS_TOOL_DRILLDOWN_VIEWBY_DEFINITIONS);
    expect(tuples.map((tuple) => tuple.label)).toEqual([
      "Category",
      "Cohorts",
      "Country",
      "Manufacturer",
      "Brand",
      "Region",
      "Portfolio",
      "Growth Levers",
    ]);
  });

  it("uses lowercase API values with display labels and full text", () => {
    const tuples = getPosToolDrilldownViewbyTuples();

    expect(tuples).toEqual([
      { value: "category", label: "Category", full: "Category" },
      { value: "cohorts", label: "Cohorts", full: "Cohorts" },
      { value: "country", label: "Country", full: "Country" },
      { value: "manufacturer", label: "Manufacturer", full: "Manufacturer" },
      { value: "brand", label: "Brand", full: "Brand" },
      { value: "region", label: "Region", full: "Region" },
      { value: "portfolio", label: "Portfolio", full: "Portfolio" },
      {
        value: "Growth Levers",
        label: "Growth Levers",
        full: "growth_levers",
      },
    ]);
  });

  it("renames Cohort to Cohorts", () => {
    const labels = getPosToolDrilldownViewbyTuples().map(
      (tuple) => tuple.label,
    );

    expect(labels).toContain("Cohorts");
    expect(labels).not.toContain("Cohort");
  });
});
