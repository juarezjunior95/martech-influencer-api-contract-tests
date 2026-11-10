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
      id: "campaign-qwoa-bubble-chart",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "5_connections_creativity_media-campaign_media-drilldown_campaigns-qwoa",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
