import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "div-by-brands",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/volume/segments-gb/div-by-brands",
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
      name: "period",
      required: true,
    },
  ],
};

export default config;
