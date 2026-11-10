import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "1_category_home_filters",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "1_category_home_filters",
        parameters: [],
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [],
};

export default config;
