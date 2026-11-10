import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "top-15-countries",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/market-share/top-15-countries",
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
      name: "zone",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "growth_lever",
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
    {
      name: "period_type",
      required: true,
    },
    {
      name: "max_ranked",
      required: false,
    },
  ],
};

export default config;
