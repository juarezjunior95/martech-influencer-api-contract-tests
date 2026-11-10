import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { ShowGlobalDataKpi } from "@domain/config/presets/show-global-data/show-global-data.types";
export declare function showGlobalDataFlagColumn(): "flag_uat" | "flag_prd";
export declare function buildShowGlobalDataDatasetConfig(subject: ShowGlobalDataKpi): DatasetConfig;
export declare function collectShowGlobalDataDatasetConfigs(subjects: Iterable<ShowGlobalDataKpi>): DatasetConfig[];
export declare function hasGlobalDataForSubject(datasets: Dataset[] | undefined, subject: ShowGlobalDataKpi): boolean;
