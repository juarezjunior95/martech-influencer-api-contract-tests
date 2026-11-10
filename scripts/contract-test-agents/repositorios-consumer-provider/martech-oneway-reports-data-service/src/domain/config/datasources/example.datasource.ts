import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "example-dataset",
      config: createDeltalakeFetchDataConfig({
        query: "example",
      }),
    },
  ],
  filters: [
    {
      name: "test",
      required: true,
    },
  ],
};

export default config;
