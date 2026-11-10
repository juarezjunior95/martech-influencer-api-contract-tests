import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "megabrands-dashboard-country",
      config: createDeltalakeFetchDataConfig({
        query:
          "value-creation/growth-league/rankings/megabrands-dashboard-country",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "dt_ini",
      required: true,
    },
    {
      name: "dt_end",
      required: true,
    },
  ],
};

export default config;
