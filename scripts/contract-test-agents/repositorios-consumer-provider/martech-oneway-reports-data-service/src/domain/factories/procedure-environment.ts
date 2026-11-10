export type ProcedureEnvironment = "UAT" | "PRD";

/**
 * Deployment environment sent to Databricks stored procedures as `environment`.
 * `UAT` when `NODE_ENV === "uat"`, otherwise `PRD`.
 */
export function getProcedureEnvironment(): ProcedureEnvironment {
  return process.env.NODE_ENV === "uat" ? "UAT" : "PRD";
}
