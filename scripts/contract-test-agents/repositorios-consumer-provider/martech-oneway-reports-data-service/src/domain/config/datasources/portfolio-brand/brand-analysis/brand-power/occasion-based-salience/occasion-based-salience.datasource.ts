import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  { name: "country", required: true },
  { name: "sub_brand", required: true },
  { name: "sub_brand_comp", required: true },
  { name: "dt_ini", required: true },
  { name: "dt_end", required: true },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  datasets: [
    {
      id: "occasion-based-salience",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "3_portfolio_brand_brand-power-drivers_occasion-based-salience_qtr",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
