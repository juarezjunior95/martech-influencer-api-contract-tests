import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  { name: "country", required: true },
  { name: "category", required: true },
  { name: "timeframe", required: true },
  { name: "dt_end", required: true },
  { name: "kpi", required: true },
  { name: "manufacturer", required: true },
  { name: "brand", required: true },
  { name: "brand_segments", required: true },
  { name: "region", required: true },
  { name: "cohort", required: true },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "owr_category_pos_tool_drill_down_line_chart_fn",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "1_category_pos-tool_drill-down_line-chart",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
