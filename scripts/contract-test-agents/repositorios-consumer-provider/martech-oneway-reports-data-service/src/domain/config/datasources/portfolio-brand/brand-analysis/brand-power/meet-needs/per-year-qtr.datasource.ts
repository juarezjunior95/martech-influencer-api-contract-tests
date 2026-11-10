import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  { name: "country", required: true },
  { name: "sub_brand", required: true },
  { name: "sub_brand_comp", required: true },
  { name: "dt_end", required: true },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "per-year-qtr",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "3_portfolio_brand_brand-power-drivers_meet-needs_meet-needs-per-year-qtr",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
