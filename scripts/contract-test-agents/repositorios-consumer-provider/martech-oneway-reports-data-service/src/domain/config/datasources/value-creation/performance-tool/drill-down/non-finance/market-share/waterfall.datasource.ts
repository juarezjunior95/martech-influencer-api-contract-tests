import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { marketShareWaterfallHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/market-share/waterfall.handler";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "non-finance-market-share-waterfall",
      config: createDeltalakeFetchDataConfig({
        query:
          "value-creation/performance-tool/drill-down/non-finance/market-share/waterfall",
      }),
    },
  ],
  handler: marketShareWaterfallHandler,
  filters: [
    {
      name: "dt_end",
      required: true,
    },
    {
      name: "period_type",
      required: true,
    },
    {
      name: "waterfall_filter",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "zone",
      required: true,
    },
    {
      name: "brand",
      required: true,
    },
    {
      name: "max_ranked",
      required: true,
    },
  ],
};

export default config;
