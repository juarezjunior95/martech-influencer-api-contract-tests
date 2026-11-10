import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "increase-participation",
      config: createDeltalakeFetchDataConfig({
        query: "consumer/home/increase-participation",
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
  ],
};

export default config;
