import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "target-audiences",
      config: createDeltalakeFetchDataConfig({
        query: "consumer/home/target-audiences",
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
      name: "dt_end",
      required: true,
    },
  ],
};

export default config;
