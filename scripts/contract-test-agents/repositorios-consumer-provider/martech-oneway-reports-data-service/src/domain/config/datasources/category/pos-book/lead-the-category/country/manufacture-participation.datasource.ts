import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "manufacture-participation",
      config: createDeltalakeFetchDataConfig({
        query:
          "category/pos-book/lead-the-category/country/manufacture-participation",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "price_segment",
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
    {
      name: "manufacturer",
      required: false,
    },
  ],
};

export default config;
