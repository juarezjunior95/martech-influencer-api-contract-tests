"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommercialResultsProcedureFetchDataConfig = createCommercialResultsProcedureFetchDataConfig;
const procedure_environment_1 = require("../../../../factories/procedure-environment");
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const RESULT_QUERY_PROCEDURE = "{{DATABRICKS_SCHEMA}}.owr_result_query_sp";
const SP_FILTER_ALIASES = {
    non_alcoholic: "non_alc_beer",
    portfolios: "portfolio",
};
function createCommercialResultsProcedureFetchDataConfig({ functionName, filterNames, }) {
    const dynamicParameters = filterNames.map((filterName) => {
        const procedureName = SP_FILTER_ALIASES[filterName] ?? filterName;
        return `"${procedureName}": :${filterName}`;
    });
    const environment = `"environment": ${JSON.stringify((0, procedure_environment_1.getProcedureEnvironment)())}`;
    const payload = [...dynamicParameters, environment].join(", ");
    return {
        procedure: `
        CALL ${RESULT_QUERY_PROCEDURE}(
          '${functionName}',
          '{${payload}}'
        );
      `,
        executionType: dataset_repository_factory_1.DeltalakeExecutionType.procedure,
        type: dataset_repository_factory_1.RepositoryType.deltalake,
    };
}
//# sourceMappingURL=commercial-results.datasource-config.js.map