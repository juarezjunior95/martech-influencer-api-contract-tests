import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "country",
    required: true,
  },
  {
    name: "sub_brand",
    required: true,
  },
  {
    name: "sub_brand_comp",
    required: true,
  },
  {
    name: "dt_end",
    required: true,
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "per-year",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "3_portfolio_brand_brand-power-drivers_unaided-awareness_unaided-awareness-ytd",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
