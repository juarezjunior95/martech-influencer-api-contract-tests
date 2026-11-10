import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "one-yp-brand-audience",
      config: createDeltalakeFetchDataConfig({
        query: "consumer/one-yp/definition/brand-audience",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "dt_end",
      required: true,
    },
    {
      name: "brand",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "product_type",
      required: true,
    },
    {
      name: "age",
      required: false,
    },
    {
      name: "gender",
      required: false,
    },
    {
      name: "socio_economic_level",
      required: false,
    },
  ],
};

export default config;
