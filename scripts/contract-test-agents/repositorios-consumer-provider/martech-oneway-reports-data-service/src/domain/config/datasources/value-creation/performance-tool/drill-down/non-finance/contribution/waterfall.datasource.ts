import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { waterfallHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/contribution/waterfall.handler";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  {
    name: "timeframe",
    required: true,
  },
  {
    name: "dt_end",
    required: true,
  },
  {
    name: "country",
    required: true,
  },
  {
    name: "viewtype",
    required: true,
  },
  {
    name: "max_ranked",
    required: true,
  },
  {
    name: "brand",
    required: true,
  },
  {
    name: "portfolio",
    required: true,
  },
  {
    name: "region",
    required: true,
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "non-finance-contribution-large",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "7_value_creation_performance-tool_power_waterfall",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: waterfallHandler,
  filters,
};

export default config;
