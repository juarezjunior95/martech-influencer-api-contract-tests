import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "line-chart",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/volume/line-chart",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "kpi",
      required: true,
    },
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
      name: "brand",
      required: true,
    },
    {
      name: "sub_brand",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "zone",
      required: true,
    },
    {
      name: "page_filter",
      required: true,
    },
    {
      name: "waterfall_filter",
      required: true,
    },
  ],
};

export default config;
