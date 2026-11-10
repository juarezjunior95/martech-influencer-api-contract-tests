import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "big-numbers",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/market-share/big-numbers",
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
      name: "growth_lever",
      required: true,
    },
  ],
};

export default config;
