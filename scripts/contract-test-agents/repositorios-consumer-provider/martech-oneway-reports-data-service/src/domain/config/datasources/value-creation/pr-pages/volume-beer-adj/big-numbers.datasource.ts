import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "big-numbers",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/volume-beer-adj/big-numbers",
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
      name: "growth_lever",
      required: true,
    },
    {
      name: "page_filter",
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
      name: "zone",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "waterfall_filter",
      required: true,
    },
    {
      name: "kpi",
      required: true,
    },
  ],
};

export default config;
