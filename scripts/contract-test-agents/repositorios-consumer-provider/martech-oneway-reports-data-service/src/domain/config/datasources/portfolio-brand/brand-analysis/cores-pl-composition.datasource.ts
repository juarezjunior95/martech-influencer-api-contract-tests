import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "brand-analysis-cores-pl-composition-monthly",
      config: createDeltalakeFetchDataConfig({
        query: "portfolio-brand/brand-analysis/cores-pl-composition/mothly",
      }),
    },
    {
      id: "brand-analysis-cores-pl-composition-yearly",
      config: createDeltalakeFetchDataConfig({
        query: "portfolio-brand/brand-analysis/cores-pl-composition/yearly",
      }),
    },
    {
      id: "brand-analysis-cores-pl-composition-ytd",
      config: createDeltalakeFetchDataConfig({
        query: "portfolio-brand/brand-analysis/cores-pl-composition/ytd",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    { name: "dt_end", required: true },
    { name: "country", required: true },
    { name: "brand", required: true },
    { name: "sub_brand", required: true },
    { name: "zone", required: true },
  ],
};

export default config;
