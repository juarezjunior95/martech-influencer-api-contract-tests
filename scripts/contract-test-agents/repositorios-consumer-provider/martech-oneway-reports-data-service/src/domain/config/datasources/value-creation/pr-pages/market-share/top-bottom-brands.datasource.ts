import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "top-bottom-brands",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/market-share/top-bottom-brands",
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
      name: "period_type",
      required: true,
    },
    {
      name: "growth_lever",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "direction",
      required: false,
    },
  ],
};

export default config;
