import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
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
    required: true,
  },
  {
    name: "zone",
    required: false,
  },
  {
    name: "timeframe",
    required: false,
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "increase-brand-power",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "3_portfolio_brand_home_increase-brand-power_trend",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
