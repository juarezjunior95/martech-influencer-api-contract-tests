import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "bar-chart",
      config: createDeltalakeFetchDataConfig({
        query:
          "value-creation/pr-pages/volume-beer-adj/brands-by-segments/bar-chart",
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
      name: "page_filter",
      required: true,
    },
    {
      name: "period_type",
      required: true,
    },
    {
      name: "kpi",
      required: true,
    },
  ],
};

export default config;
