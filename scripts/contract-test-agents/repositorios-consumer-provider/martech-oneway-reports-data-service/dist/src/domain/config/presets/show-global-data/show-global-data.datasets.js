"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showGlobalDataFlagColumn = showGlobalDataFlagColumn;
exports.buildShowGlobalDataDatasetConfig = buildShowGlobalDataDatasetConfig;
exports.collectShowGlobalDataDatasetConfigs = collectShowGlobalDataDatasetConfigs;
exports.hasGlobalDataForSubject = hasGlobalDataForSubject;
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const show_global_data_types_1 = require("./show-global-data.types");
const OWR_RESULT_QUERY_SP = "{{DATABRICKS_SCHEMA}}.owr_result_query_sp";
function nodeEnv() {
    return process.env.NODE_ENV ?? "production";
}
function showGlobalDataFlagColumn() {
    return nodeEnv() === "uat" ? "flag_uat" : "flag_prd";
}
function subjectProcedureConfig(subject) {
    return {
        type: dataset_repository_factory_1.RepositoryType.deltalake,
        executionType: dataset_repository_factory_1.DeltalakeExecutionType.procedure,
        procedure: `
        CALL ${OWR_RESULT_QUERY_SP}(
          '${show_global_data_types_1.SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION}',
          '{"subject": "${subject}"}'
        );
      `,
    };
}
function buildShowGlobalDataDatasetConfig(subject) {
    return {
        id: (0, show_global_data_types_1.showGlobalDatasetIdForSubject)(subject),
        config: subjectProcedureConfig(subject),
    };
}
function collectShowGlobalDataDatasetConfigs(subjects) {
    const seen = new Set();
    const order = [];
    for (const s of subjects) {
        if (!seen.has(s)) {
            seen.add(s);
            order.push(s);
        }
    }
    const rank = (a, b) => show_global_data_types_1.SHOW_GLOBAL_DATA_SUBJECTS.indexOf(a) - show_global_data_types_1.SHOW_GLOBAL_DATA_SUBJECTS.indexOf(b);
    order.sort(rank);
    return order.map((subject) => buildShowGlobalDataDatasetConfig(subject));
}
function readRowValue(row, canonicalKey) {
    if (Object.prototype.hasOwnProperty.call(row, canonicalKey)) {
        return row[canonicalKey];
    }
    const target = canonicalKey.toLowerCase();
    for (const k of Object.keys(row)) {
        if (k.toLowerCase() === target) {
            return row[k];
        }
    }
    return undefined;
}
function coerceYn(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const t = value.trim().toLowerCase();
    if (t === "y") {
        return true;
    }
    if (t === "n") {
        return false;
    }
    return undefined;
}
function hasGlobalDataForSubject(datasets, subject) {
    const id = (0, show_global_data_types_1.showGlobalDatasetIdForSubject)(subject);
    const dataset = datasets?.find((d) => d.id === id);
    const head = dataset?.data?.[0];
    if (!head) {
        return false;
    }
    const flagKey = showGlobalDataFlagColumn();
    const rawFlag = readRowValue(head, flagKey);
    return coerceYn(rawFlag) ?? false;
}
//# sourceMappingURL=show-global-data.datasets.js.map