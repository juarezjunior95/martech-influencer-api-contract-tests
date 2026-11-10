import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "category-health-overview",
      config: createDeltalakeFetchDataConfig({
        query: "category/category-health/overview",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "year",
      required: true,
    },
    {
      name: "category",
      required: true,
    },
  ],
};

export default config;
