import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { strategicInnovationPillarsHandler } from "@domain/handlers/innovation/innovation/overview/strategic-innovation-pillars.handler";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "viewtype",
  },
  {
    name: "country",
  },
  {
    name: "dt_end",
  },
  {
    name: "kpi",
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "strategic-innovation-pillars",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "4_innovation_innovation-performance_overview_strategic-innovation-pillars",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: strategicInnovationPillarsHandler,
  entityClass: KpiEntity,
  filters,
};

export default config;
