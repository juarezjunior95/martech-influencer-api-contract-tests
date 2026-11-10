import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { propertiesTableHandler } from "@domain/handlers/value-creation/pr-pages/volume/segments-gb/table.handler";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "segments-gb_table",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/volume-beer-adj/segments-gb/table",
      }),
    },
  ],
  entityClass: KpiEntity,
  handler: propertiesTableHandler,
  filters: [
    {
      name: "dt_end",
      required: true,
    },
    {
      name: "page_type",
      required: true,
    },
  ],
};

export default config;
