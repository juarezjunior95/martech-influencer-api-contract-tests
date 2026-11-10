import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createBrandPowerResultsProcedureFetchDataConfig } from "@domain/config/datasources/portfolio-brand/brand-power-book/overview/performance-breakdown-and-summary-power/performance-breakdown-and-summary-power.datasource";

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
    name: "viewtype",
    required: true,
  },
  {
    name: "zone_maturity",
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
      id: "zone_maturity_power_details",
      config: createBrandPowerResultsProcedureFetchDataConfig(filters, {
        visual: "COUNTRY",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
