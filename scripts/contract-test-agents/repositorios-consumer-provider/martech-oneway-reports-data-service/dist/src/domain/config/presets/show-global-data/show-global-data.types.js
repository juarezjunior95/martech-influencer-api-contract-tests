"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHOW_GLOBAL_DATA_SUBJECTS = exports.SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION = void 0;
exports.showGlobalDatasetIdForSubject = showGlobalDatasetIdForSubject;
exports.SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION = "8_shared_global-parameter-filter";
exports.SHOW_GLOBAL_DATA_SUBJECTS = ["pos", "power"];
function showGlobalDatasetIdForSubject(subject) {
    return `show-global-data-${subject}`;
}
//# sourceMappingURL=show-global-data.types.js.map