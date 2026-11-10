import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "one-yp-core-audience-performance",
      config: createDeltalakeFetchDataConfig({
        query: "consumer/one-yp/performance/core-audience-performance",
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
      name: "brand",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
  ],
};

export default config;
