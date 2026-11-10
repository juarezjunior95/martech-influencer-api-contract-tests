import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "brand-power-chart-tooltip",
      config: createDeltalakeFetchDataConfig({
        query: "portfolio-brand/brand-analysis/brand-power/chart/tooltip",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    { name: "country", required: true },
    { name: "zone", required: true },
    { name: "brand", required: true },
    { name: "sub_brand", required: true },
    { name: "dt_end", required: true },
  ],
};

export default config;
