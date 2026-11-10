import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "country",
    required: true,
  },
  {
    name: "dt_end",
    required: true,
  },
  {
    name: "page_filter",
    required: true,
  },
  {
    name: "viewtype",
    required: true,
  },
  {
    name: "period_type",
    required: false,
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "big-numbers-st",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "3_portfolio_brand_power-book_overview_big-numbers",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
