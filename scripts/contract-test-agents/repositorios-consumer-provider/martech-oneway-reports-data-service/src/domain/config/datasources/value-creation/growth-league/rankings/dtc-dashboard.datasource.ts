import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "dtc-dashboard",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/growth-league/rankings/dtc-dashboard",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "dt_end",
    },
    {
      name: "dt_ini",
    },
  ],
};

export default config;
