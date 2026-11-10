import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "sustainable-growth-overview-finance",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/home/sustainable-growth-overview/finance",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "country",
    },
    {
      name: "kpi_name",
    },
    {
      name: "dt_end",
    },
    {
      name: "viewtype",
    },
    {
      name: "period",
    },
    {
      name: "growth_lever",
    },
  ],
};

export default config;
