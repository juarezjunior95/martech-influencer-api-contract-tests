import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "dt_end",
    required: true,
  },
  {
    name: "page_filter",
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
      id: "countries_contribution",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "3_portfolio_brand_power-book_overview_waterfall",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
