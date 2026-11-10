import { FilterConfig } from "@domain/entities/datasource.entity";
import { DeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
export declare const BRAND_POWER_RESULTS_PERFORMANCE_BREAKDOWN_FUNCTION = "3_portfolio_brand_power-book_overview_breakdown";
export declare function createBrandPowerResultsProcedureFetchDataConfig(filters: FilterConfig[], staticParams?: Record<string, string>): DeltalakeFetchDataConfig;
