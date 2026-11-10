import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntityNegativeZero } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "participation-ranking",
      config: createDeltalakeFetchDataConfig({
        query:
          "category/pos-book/lead-the-category/global/participation-ranking",
      }),
    },
  ],
  entityClass: KpiEntityNegativeZero,
  filters: [
    {
      name: "cohort",
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
  ],
};

export default config;
