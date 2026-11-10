import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_DATASET_ID,
  PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_SP_NAME,
} from "@domain/config/presets/performance-tool/performance-tool.types";

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_SP_NAME,
        parameters: [],
      }),
    },
  ],
};

export default config;
