import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { yearByYearPowerAcPowerMixHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/power-performance-trend/year-by-year-power-ac-power-mix.handler";

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
      id: "yearly_power_ac_power_mix",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "3_portfolio_brand_power-book_power-performance_trend",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: yearByYearPowerAcPowerMixHandler,
  filters,
};

export default config;
