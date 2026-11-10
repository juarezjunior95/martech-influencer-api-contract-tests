import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { performanceToolByOverTimeTrendsHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/overtime-trends/overtime-trends.handler";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  {
    name: "viewtype",
    required: true,
  },
  {
    name: "page_filter",
    required: true,
  },
  {
    name: "brand",
    required: true,
  },
  {
    name: "country",
    required: true,
  },
  {
    name: "region",
    required: true,
  },
  {
    name: "dt_end",
    required: true,
  },
  {
    name: "timeframe",
    required: true,
  },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  datasets: [
    {
      id: "non-finance-overtime-trends-by-snapshot",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "7_value_creation_brand-power_bar-chart",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: performanceToolByOverTimeTrendsHandler,
  filters,
};

export default config;
