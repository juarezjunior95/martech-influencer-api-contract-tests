import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "cohort",
      config: createDeltalakeFetchDataConfig({
        query: "category/pos-book/grow-the-category/cohort",
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
      name: "dt_end",
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
  ],
};

export default config;
