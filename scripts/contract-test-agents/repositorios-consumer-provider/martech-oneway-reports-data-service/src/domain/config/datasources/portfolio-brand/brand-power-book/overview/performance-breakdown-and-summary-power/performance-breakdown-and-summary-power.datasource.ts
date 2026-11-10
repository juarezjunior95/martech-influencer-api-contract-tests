import { FilterConfig } from "@domain/entities/datasource.entity";
import {
  createDeltalakeProcedureFetchDataConfig,
  DeltalakeFetchDataConfig,
} from "@domain/factories/dataset-repository.factory";

export const BRAND_POWER_RESULTS_PERFORMANCE_BREAKDOWN_FUNCTION =
  "3_portfolio_brand_power-book_overview_breakdown";

export function createBrandPowerResultsProcedureFetchDataConfig(
  filters: FilterConfig[],
  staticParams?: Record<string, string>,
): DeltalakeFetchDataConfig {
  return createDeltalakeProcedureFetchDataConfig({
    functionName: BRAND_POWER_RESULTS_PERFORMANCE_BREAKDOWN_FUNCTION,
    parameters: filters.map((filter) => filter.name),
    staticParams,
  });
}
