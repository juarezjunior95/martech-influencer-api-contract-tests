import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "consumer-behavior",
      config: createDeltalakeFetchDataConfig({
        query: "category/home/consumer-behavior",
      }),
    },
  ],
  entityClass: KpiEntity,
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
      name: "timeperiod",
      required: true,
    },
    {
      name: "environment",
      required: true,
    },
  ],
};

export default config;
