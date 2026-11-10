import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "brand-audience",
      config: createDeltalakeFetchDataConfig({
        query: "consumer/audience-targeting/definition/brand-audience",
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
