export type DatasourceFilter = {
    name: string;
    required?: boolean | undefined;
};
export type DatasourceInfo = {
    name: string;
    filters?: DatasourceFilter[];
};
export type DatasourceTreeNode = {
    datasources?: DatasourceInfo[];
    folders?: Record<string, DatasourceTreeNode>;
};
export declare function getGroupedAvailableDatasources(): Record<string, DatasourceTreeNode>;
export declare function getAllAvailableDatasources(): string[];
export declare function generateDatasourcesDescription(): string;
