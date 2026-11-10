import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "participation-portfolio",
      config: createDeltalakeFetchDataConfig({
        query:
          "category/pos-book/lead-the-category/global/participation-portfolio",
      }),
    },
  ],
  entityClass: KpiEntity,
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
