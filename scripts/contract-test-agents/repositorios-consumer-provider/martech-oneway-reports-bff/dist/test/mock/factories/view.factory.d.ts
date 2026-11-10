import { ViewConfig, FilterSet, ComponentConfig, DataSourceConfig, DataSource, Filter } from "../../../src/domain/entities/view.entity";
export declare class ViewConfigFactory {
    static create(overrides?: Partial<ViewConfig>): ViewConfig;
    static createWithComponents(componentCount: number, overrides?: Partial<ViewConfig>): ViewConfig;
}
export declare class ComponentConfigFactory {
    static create(overrides?: Partial<ComponentConfig>): ComponentConfig;
    static createWithDatasources(datasourceCount: number, overrides?: Partial<ComponentConfig>): ComponentConfig;
}
export declare class DataSourceConfigFactory {
    static create(overrides?: Partial<DataSourceConfig>): DataSourceConfig;
}
export declare class FilterSetFactory {
    static create(overrides?: Partial<FilterSet>): FilterSet;
    static createWithFilters(filterCount: number, overrides?: Partial<FilterSet>): FilterSet;
}
export declare class FilterFactory {
    static create(overrides?: Partial<Filter>): Filter;
}
export declare class DataSourceFactory {
    static create(overrides?: Partial<DataSource>): DataSource;
    static createWithItems(itemCount: number, overrides?: Partial<DataSource>): DataSource;
}
