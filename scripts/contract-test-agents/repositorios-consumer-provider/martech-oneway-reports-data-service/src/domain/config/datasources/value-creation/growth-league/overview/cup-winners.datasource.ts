import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "cup-winners",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/growth-league/overview/cup-winners",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [],
};

export default config;
