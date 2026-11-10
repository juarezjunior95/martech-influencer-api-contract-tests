import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
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
    name: "period",
    required: true,
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "test-procedure-dataset",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "4_innovation_home_overtime-performance",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
