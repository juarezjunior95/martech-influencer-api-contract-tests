import { PosToolDrilldownTuple } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";

export const POS_TOOL_DRILLDOWN_VIEWBY_DEFINITIONS: PosToolDrilldownTuple[] = [
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
];

export function getPosToolDrilldownViewbyTuples(): PosToolDrilldownTuple[] {
  return POS_TOOL_DRILLDOWN_VIEWBY_DEFINITIONS;
}
