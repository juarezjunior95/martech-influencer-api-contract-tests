import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [{ name: "dt_end", required: true }];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "rank",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "7_value_creation_growth-league_overview_leaderboard",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
