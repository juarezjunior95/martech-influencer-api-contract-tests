import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  { name: "country", required: true },
  { name: "category", required: true },
  { name: "time_frame", required: true },
  { name: "dt_end", required: true },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "pos-performance-tool-overview-overtime-performance",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "1_category_pos-tool_overview_big-numbers",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
