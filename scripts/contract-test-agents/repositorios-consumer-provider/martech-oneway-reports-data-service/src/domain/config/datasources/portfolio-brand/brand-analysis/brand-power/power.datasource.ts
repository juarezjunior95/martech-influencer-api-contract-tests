import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "brand-power-power-full-year",
      config: createDeltalakeFetchDataConfig({
        query: "portfolio-brand/brand-analysis/brand-power/power/full-year",
      }),
    },
    {
      id: "brand-power-power-per-year-qtr",
      config: createDeltalakeFetchDataConfig({
        query: "portfolio-brand/brand-analysis/brand-power/power/per-year-qtr",
      }),
    },
    {
      id: "brand-power-power-ytd",
      config: createDeltalakeFetchDataConfig({
        query: "portfolio-brand/brand-analysis/brand-power/power/ytd",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    { name: "dt_end", required: true },
    { name: "viewtype", required: true },
    { name: "zone", required: true },
    { name: "country", required: true },
    { name: "sub_brand", required: true },
    { name: "sub_brand_comp", required: true },
  ],
};

export default config;
