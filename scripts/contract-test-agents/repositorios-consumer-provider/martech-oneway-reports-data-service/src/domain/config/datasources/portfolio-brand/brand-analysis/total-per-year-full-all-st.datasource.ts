import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "total-per-year-full-all-st",
      config: createDeltalakeFetchDataConfig({
        query: "portfolio-brand/brand-analysis/total-per-year-full-all-st",
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
      name: "zone",
      required: true,
    },
    {
      name: "brand",
      required: true,
    },
    {
      name: "sub_brand",
      required: true,
    },
  ],
};

export default config;
