import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { mustWinMarketsHandler } from "@domain/handlers/value-creation/pr-pages/volume/must-win-markets.handler";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "must-win-markets",
      config: createDeltalakeFetchDataConfig({
        query: "value-creation/pr-pages/volume/must-win-markets",
      }),
    },
  ],
  handler: mustWinMarketsHandler,
  filters: [
    {
      name: "dt_end",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "page_type",
      required: true,
    },
    {
      name: "kpi",
      required: true,
    },
  ],
};

export default config;
