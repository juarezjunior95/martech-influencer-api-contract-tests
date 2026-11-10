import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "period",
    required: true,
  },
  {
    name: "viewtype",
    required: true,
  },
  {
    name: "country",
    required: true,
  },
  {
    name: "dt_ini",
    required: true,
  },
  {
    name: "dt_end",
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
      id: "portfolio-performance-pl-brand-growth-contribution",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "3_portfolio_brand_country-brand-and-portfolio-p&l_brands-growth",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
