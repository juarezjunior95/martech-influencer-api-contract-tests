import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "growth-levers",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/market-share/growth-levers",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "dt_end",
      required: true,
    },
    {
      name: "view_level",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "growth_lever",
      required: true,
    },
  ],
};

export default config;
