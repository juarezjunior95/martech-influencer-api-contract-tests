import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "country",
    required: true,
  },
  {
    name: "timeframe",
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
      id: "grow-the-category",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "1_category_home_beer-volume-big-number-trend",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
