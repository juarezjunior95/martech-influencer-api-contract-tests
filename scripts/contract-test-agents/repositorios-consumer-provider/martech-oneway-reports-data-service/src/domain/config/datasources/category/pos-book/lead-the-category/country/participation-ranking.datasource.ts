import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntityNegativeZero } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "participation-ranking",
      config: createDeltalakeFetchDataConfig({
        query:
          "category/pos-book/lead-the-category/country/participation-ranking",
      }),
    },
  ],
  entityClass: KpiEntityNegativeZero,
  filters: [
    {
      name: "price_segment",
      required: true,
    },
    {
      name: "dt_end",
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
      name: "country",
      required: true,
    },
  ],
};

export default config;
