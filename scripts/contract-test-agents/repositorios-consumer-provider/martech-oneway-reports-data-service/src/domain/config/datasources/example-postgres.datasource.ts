import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDatabaseFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "example-postgres-dataset",
      config: createDatabaseFetchDataConfig({
        query: "example-postgres",
      }),
    },
  ],
  filters: [
    {
      name: "country",
      required: true,
    },
    {
      name: "dt_end",
      required: true,
    },
    {
      name: "page_filter",
    },
    {
      name: "viewtype",
      required: false,
    },
    {
      name: "zone",
      required: false,
    },
  ],
};

export default config;
