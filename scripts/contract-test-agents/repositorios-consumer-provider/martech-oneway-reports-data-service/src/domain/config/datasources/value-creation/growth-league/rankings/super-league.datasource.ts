import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "dt_end",
    required: true,
  },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  datasets: [
    {
      id: "super-league",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "7_value_creation_growth-league_ranking-breakdown_breakdown",
        parameters: filters.map((filter) => filter.name),
        staticParams: { league: "super" },
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
