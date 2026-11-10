import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  { name: "country", required: true },
  { name: "category", required: true },
  { name: "time_frame", required: true },
  { name: "dt_end", required: true },
  { name: "periods", required: true },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "1_category_pos-tool_overview_pos-overtime-performance-comparison",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "1_category_pos-tool_overview_pos-overtime-performance-comparison",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
