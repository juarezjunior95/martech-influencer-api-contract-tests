import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "viewtype",
    required: true,
  },
  {
    name: "country",
    required: true,
  },
  {
    name: "dt_ini",
    required: true,
  },
  {
    name: "dt_end",
    required: true,
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "megabrands-over-45-qwoa-brands-over-guideline",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "5_connections_creativity_media-campaign_media-drilldown_media-qwoa-comparison-row",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
