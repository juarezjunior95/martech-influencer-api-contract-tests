import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "bees-dashboard-acceleration-index",
      config: createDeltalakeFetchDataConfig({
        query:
          "value-creation/growth-league/rankings/bees-dashboard-acceleration-index",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [],
};

export default config;
