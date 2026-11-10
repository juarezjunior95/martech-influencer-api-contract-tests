import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: "card-chart",
      config: createDeltalakeFetchDataConfig({
        query: "trade-execution/home/home",
      }),
    },
  ],
  filters: [
    {
      name: "country",
      required: true,
    },
    {
      name: "viewtype",
      required: true,
    },
    {
      name: "scope",
      required: true,
    },
    {
      name: "pageview",
      required: true,
    },
  ],
};

export default config;
