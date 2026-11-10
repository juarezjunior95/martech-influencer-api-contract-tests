import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

export interface PosToolDrilldownBreakdownDatasourceOptions {
  functionSuffix: string;
  filterNames: string[];
}

export function createPosToolDrilldownBreakdownDatasource({
  functionSuffix,
  filterNames,
}: PosToolDrilldownBreakdownDatasourceOptions): DatasourceConfig {
  const datasetIdSuffix = functionSuffix.replace(/-/g, "_");
  const filters = filterNames.map((name) => ({ name, required: true }));

  return {
    datasets: [
      {
        id: `owr_category_pos_tool_drill_down_breakdown${datasetIdSuffix}_fn`,
        config: createDeltalakeProcedureFetchDataConfig({
          functionName: `1_category_pos-tool_drill-down_breakdown${functionSuffix}`,
          parameters: filterNames,
        }),
      },
    ],
    entityClass: KpiEntity,
    filters,
  };
}
