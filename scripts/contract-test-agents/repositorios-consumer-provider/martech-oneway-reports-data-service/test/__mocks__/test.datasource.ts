import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "test",
      config: createDeltalakeFetchDataConfig({
        query: "test",
      }),
    },
  ],
  filters: [
    {
      name: "country",
      required: true,
    },
  ],
};

export default config;
