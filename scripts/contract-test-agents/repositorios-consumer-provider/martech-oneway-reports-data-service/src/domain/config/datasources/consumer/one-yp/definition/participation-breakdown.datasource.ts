import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "one-yp-participation-breakdown",
      config: createDeltalakeFetchDataConfig({
        query: "consumer/one-yp/definition/participation-breakdown",
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
    {
      name: "brand",
      required: true,
    },
    {
      name: "competitor",
      required: true,
    },
  ],
};

export default config;
