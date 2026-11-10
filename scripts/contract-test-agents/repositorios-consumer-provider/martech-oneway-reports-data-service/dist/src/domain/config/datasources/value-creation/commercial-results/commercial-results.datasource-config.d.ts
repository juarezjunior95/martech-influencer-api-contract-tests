import { DeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
interface CommercialResultsProcedureConfig {
    functionName: string;
    filterNames: readonly string[];
}
export declare function createCommercialResultsProcedureFetchDataConfig({ functionName, filterNames, }: CommercialResultsProcedureConfig): DeltalakeFetchDataConfig;
export {};
