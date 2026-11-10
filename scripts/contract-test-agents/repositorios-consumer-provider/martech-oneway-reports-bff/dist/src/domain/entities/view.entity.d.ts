export interface ViewProps {
    view: string;
    config: ViewConfig;
    filterSets?: FilterSet[];
}
export interface CacheConfig {
    enabled: boolean;
    tags: string[];
}
export interface FilterConfig {
    default: {
        name: string;
    }[];
    [key: string]: {
        name: string;
    }[];
}
export interface ViewConfig {
    version: string;
    cache?: CacheConfig;
    compressed?: boolean;
    filters?: FilterConfig;
    components: ComponentConfig[];
}
export interface ComponentConfig {
    id: string;
    formatter: string;
    datasources: DataSourceConfig[];
}
export interface DataSourceConfig {
    name: string;
    title?: string;
    filterSet?: string;
    filters?: {
        name: string;
        defaultValue?: string | number | boolean;
    }[];
}
export interface Filter {
    name: string;
    value: string | number | boolean;
}
export interface FilterSet {
    name: string;
    filters: Filter[];
}
export interface DataSourceItem {
    [key: string]: string | number | boolean;
}
export interface DataSource {
    name: string;
    title?: string;
    data: DataSourceItem[];
}
export interface ProcessedComponentProps {
    id: string;
    data?: any;
    error?: string;
}
export interface ProcessedViewResult {
    view: string;
    components: ProcessedComponent[];
    compressed?: boolean;
}
export declare class ProcessedComponent {
    readonly id: string;
    readonly data?: any;
    readonly error?: string;
    private constructor();
    static create(props: ProcessedComponentProps): ProcessedComponent;
}
export declare class View {
    private view;
    private config;
    private filterSets;
    private constructor();
    static create(props: ViewProps): View;
    getView(): string;
    private setConfig;
    private validateConfig;
    private validateComponent;
    private validateUniqueComponentIds;
    getComponents(): ComponentConfig[];
    getComponentsToProcess(): ComponentConfig[];
    setFilterSets(filterSets: FilterSet[]): void;
    getFilterSets(sorted?: boolean): FilterSet[];
    private getFilterSetByName;
    getFilterSetByDatasourceConfig(datasourceConfig: DataSourceConfig): FilterSet | undefined;
    getDefaultFilterSet(): FilterSet | undefined;
    getFiltersForDatasource(datasourceConfig: DataSourceConfig): Filter[] | undefined;
    getCacheConfig(): CacheConfig;
    getCompressed(): boolean;
}
