import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "power-performance-trend-by-trend-over-time",
      config: createDeltalakeFetchDataConfig({
        query:
          "portfolio-brand/brand-power-book/overview/power-performance-trend/by-trend-over-time",
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
      name: "country",
      required: true,
    },
    {
      name: "page_filter",
      required: true,
    },
    {
      name: "viewtype",
      required: true,
    },
    {
      name: "zone",
      required: true,
    },
  ],
};

export default config;
