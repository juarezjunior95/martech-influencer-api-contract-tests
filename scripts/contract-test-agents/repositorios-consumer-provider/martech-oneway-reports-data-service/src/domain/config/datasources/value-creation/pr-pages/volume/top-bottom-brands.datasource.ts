import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "top-bottom-brands",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/volume/top-bottom-brands",
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
      name: "page_type",
      required: true,
    },
    {
      name: "period",
      required: true,
    },
    {
      name: "growth_lever",
      required: true,
    },
    {
      name: "view_level",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "reporttype",
      required: true,
    },
  ],
};

export default config;
