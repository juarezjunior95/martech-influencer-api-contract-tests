import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { byTrendOverTimePowerMixHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/power-performance-trend/by-trend-over-time-power-mix.handler";

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
    name: "zone",
    required: true,
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "trend_over_time_power_mix",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "3_portfolio_brand_power-book_power-mix_qtr",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: byTrendOverTimePowerMixHandler,
  filters,
};

export default config;
