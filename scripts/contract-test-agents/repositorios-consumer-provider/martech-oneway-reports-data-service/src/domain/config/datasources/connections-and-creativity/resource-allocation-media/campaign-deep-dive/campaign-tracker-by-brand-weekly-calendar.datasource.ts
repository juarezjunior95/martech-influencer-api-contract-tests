import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "campaign-tracker-by-brand-weekly-calendar",
      config: createDeltalakeFetchDataConfig({
        query:
          "connections-and-creativity/resource-allocation-media/campaign-deep-dive/campaign-tracker-by-brand-weekly-calendar",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "country",
      required: true,
    },
    {
      name: "dt_ini",
      required: true,
    },
  ],
};

export default config;
