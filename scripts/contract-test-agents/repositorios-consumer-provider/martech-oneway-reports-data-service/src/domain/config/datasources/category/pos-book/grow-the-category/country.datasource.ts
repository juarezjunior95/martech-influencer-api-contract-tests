import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "country",
      config: createDeltalakeFetchDataConfig({
        query: "category/pos-book/grow-the-category/country",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "pos_kpi",
      required: true,
    },
    {
      name: "timeperiod",
      required: true,
    },
    {
      name: "cohort",
      required: true,
    },
    {
      name: "dt_end",
      required: true,
    },
  ],
};

export default config;
