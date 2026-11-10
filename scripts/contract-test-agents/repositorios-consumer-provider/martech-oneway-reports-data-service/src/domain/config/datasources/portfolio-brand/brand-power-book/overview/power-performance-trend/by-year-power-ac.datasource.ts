import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "yearly_power_ac",
      config: createDeltalakeFetchDataConfig({
        query:
          "portfolio-brand/brand-power-book/overview/power-performance-trend/by-year-power-ac",
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
      name: "dt_end",
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
