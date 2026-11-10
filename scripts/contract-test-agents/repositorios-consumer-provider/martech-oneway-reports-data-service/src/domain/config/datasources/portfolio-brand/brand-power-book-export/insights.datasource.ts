import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  {
    name: "period",
    required: false,
  },
  {
    name: "scope",
    required: false,
  },
  {
    name: "segmented_control",
    required: false,
  },
  {
    name: "sub_scope",
    required: false,
  },
  {
    name: "template",
    required: false,
  },
  {
    name: "timeframe",
    required: false,
  },
  {
    name: "type",
    required: false,
  },
  {
    name: "zone",
    required: false,
  },
  {
    name: "country",
    required: false,
  },
  {
    name: "insights_title",
    required: false,
  },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  datasets: [
    {
      id: "brand-power-book-export-insights",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "3_portfolio_brand_brand-power-results-export_insigths",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
