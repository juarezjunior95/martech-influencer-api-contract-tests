import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "breakdown",
      config: createDeltalakeFetchDataConfig({
        query: "consumer/audience-targeting/performance/breakdown",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "brand",
      required: true,
    },
    {
      name: "competitor",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "kpi_name",
      required: true,
    },
    {
      name: "dt_end",
      required: true,
    },
  ],
};

export default config;
