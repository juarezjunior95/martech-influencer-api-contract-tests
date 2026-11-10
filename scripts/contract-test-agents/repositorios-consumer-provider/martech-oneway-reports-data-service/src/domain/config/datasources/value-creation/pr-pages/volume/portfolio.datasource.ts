import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "portfolio",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/volume/portfolio",
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
      name: "page_type",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "kpi",
      required: true,
    },
  ],
};

export default config;
