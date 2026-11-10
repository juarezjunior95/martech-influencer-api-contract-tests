import { DatasourceConfig } from "@domain/entities/datasource.entity";
export interface PosToolDrilldownBreakdownDatasourceOptions {
    functionSuffix: string;
    filterNames: string[];
}
export declare function createPosToolDrilldownBreakdownDatasource({ functionSuffix, filterNames, }: PosToolDrilldownBreakdownDatasourceOptions): DatasourceConfig;
