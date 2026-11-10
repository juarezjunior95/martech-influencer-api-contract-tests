import { createPosToolDrilldownBreakdownDatasource } from "./breakdown-datasource.factory";

const config = createPosToolDrilldownBreakdownDatasource({
  functionSuffix: "-growth-levers",
  filterNames: [
    "country",
    "category",
    "timeframe",
    "dt_end",
    "kpi",
    "view_by",
    "manufacturer",
    "brand",
    "brand_segments",
    "region",
    "cohort",
  ],
});

export default config;
