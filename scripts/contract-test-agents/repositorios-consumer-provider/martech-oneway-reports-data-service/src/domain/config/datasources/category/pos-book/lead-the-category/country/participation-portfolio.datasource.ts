import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "participation-portfolio",
      config: createDeltalakeFetchDataConfig({
        query:
          "category/pos-book/lead-the-category/country/participation-portfolio",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "timeperiod",
      required: true,
    },
    {
      name: "dt_end",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
  ],
};

export default config;
