import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "brand-power-bip-per-year-qtr",
      config: createDeltalakeFetchDataConfig({
        query: "portfolio-brand/brand-analysis/brand-power/bip/per-year-qtr",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    { name: "country", required: true },
    { name: "sub_brand", required: true },
    { name: "sub_brand_comp", required: true },
  ],
};

export default config;
