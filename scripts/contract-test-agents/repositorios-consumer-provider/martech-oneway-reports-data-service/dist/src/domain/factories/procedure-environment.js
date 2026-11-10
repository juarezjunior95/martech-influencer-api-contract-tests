"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcedureEnvironment = getProcedureEnvironment;
function getProcedureEnvironment() {
    return process.env.NODE_ENV === "uat" ? "UAT" : "PRD";
}
//# sourceMappingURL=procedure-environment.js.map