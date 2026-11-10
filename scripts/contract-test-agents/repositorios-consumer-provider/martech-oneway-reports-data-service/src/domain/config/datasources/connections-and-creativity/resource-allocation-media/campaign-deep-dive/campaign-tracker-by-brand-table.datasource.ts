import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "campaign-tracker-by-brand-table",
      config: createDeltalakeFetchDataConfig({
        query:
          "connections-and-creativity/resource-allocation-media/campaign-deep-dive/campaign-tracker-by-brand-table",
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
