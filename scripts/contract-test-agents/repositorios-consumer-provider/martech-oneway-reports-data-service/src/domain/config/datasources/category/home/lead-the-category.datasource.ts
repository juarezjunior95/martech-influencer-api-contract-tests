import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "lead-the-category",
      config: createDeltalakeFetchDataConfig({
        query: "category/home/lead-the-category",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    { name: "country", required: true },
    { name: "viewtype", required: true },
    { name: "dt_end", required: true },
  ],
};

export default config;
