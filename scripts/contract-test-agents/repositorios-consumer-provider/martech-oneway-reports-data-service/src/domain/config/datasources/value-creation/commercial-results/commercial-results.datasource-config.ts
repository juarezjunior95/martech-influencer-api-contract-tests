import { getProcedureEnvironment } from "@domain/factories/procedure-environment";
import {
  DeltalakeExecutionType,
  DeltalakeFetchDataConfig,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

const RESULT_QUERY_PROCEDURE = "{{DATABRICKS_SCHEMA}}.owr_result_query_sp";

const SP_FILTER_ALIASES: Record<string, string> = {
  non_alcoholic: "non_alc_beer",
  portfolios: "portfolio",
};

interface CommercialResultsProcedureConfig {
  functionName: string;
  filterNames: readonly string[];
}

/**
 * Builds the Commercial Results SP payload while preserving the public
 * Front/BFF filter names as Databricks markers.
 */
export function createCommercialResultsProcedureFetchDataConfig({
  functionName,
  filterNames,
}: CommercialResultsProcedureConfig): DeltalakeFetchDataConfig {
  const dynamicParameters = filterNames.map((filterName) => {
    const procedureName = SP_FILTER_ALIASES[filterName] ?? filterName;
    return `"${procedureName}": :${filterName}`;
  });
  const environment = `"environment": ${JSON.stringify(
    getProcedureEnvironment(),
  )}`;
  const payload = [...dynamicParameters, environment].join(", ");

  return {
    procedure: `
        CALL ${RESULT_QUERY_PROCEDURE}(
          '${functionName}',
          '{${payload}}'
        );
      `,
    executionType: DeltalakeExecutionType.procedure,
    type: RepositoryType.deltalake,
  };
}
