import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "dt_end",
    required: true,
  },
  {
    name: "visual",
    required: true,
  },
  {
    name: "period_type",
    required: false,
  },
  {
    name: "viewtype",
    required: false,
  },
  {
    name: "page_filter",
    required: false,
  },
  {
    name: "country",
    required: false,
  },
];

const config: DatasourceConfig = {
  filters,
  datasets: [
    {
      id: "power_performance",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "3_portfolio_brand_power-book_overview_performance-breakdown",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
};

export default config;
