import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createBrandPowerResultsProcedureFetchDataConfig } from "@domain/config/datasources/portfolio-brand/brand-power-book/overview/performance-breakdown-and-summary-power/performance-breakdown-and-summary-power.datasource";

const filters = [
  {
    name: "page_filter",
    required: true,
  },
  {
    name: "country",
    required: true,
  },
  {
    name: "dt_end",
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
      id: "summary_power_brand_breakdown",
      config: createBrandPowerResultsProcedureFetchDataConfig(filters, {
        visual: "BRAND",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
