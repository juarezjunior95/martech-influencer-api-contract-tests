import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "increase-abi-lovers",
      config: createDeltalakeFetchDataConfig({
        query: "consumer/home/increase-abi-lovers",
      }),
    },
  ],
  entityClass: KpiEntity,
  filters: [
    {
      name: "country",
      required: true,
    },
    {
      name: "zone",
      required: true,
    },
    {
      name: "viewtype",
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
  ],
};

export default config;
