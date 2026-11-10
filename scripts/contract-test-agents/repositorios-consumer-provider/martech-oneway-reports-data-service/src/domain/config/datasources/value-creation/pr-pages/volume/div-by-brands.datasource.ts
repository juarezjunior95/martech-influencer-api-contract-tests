import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "div-by-brands",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/volume/div-by-brands",
        injectProcedureEnvironment: true,
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
      name: "country",
      required: true,
    },
    {
      name: "period_type",
      required: true,
    },
    {
      name: "filter_type",
      required: true,
    },
  ],
};

export default config;
