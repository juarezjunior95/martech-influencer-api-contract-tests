"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = exports.ProcessedComponent = void 0;
const invalid_view_config_error_1 = require("../exceptions/invalid-view-config.error");
const view_not_found_error_1 = require("../exceptions/view-not-found.error");
class ProcessedComponent {
    constructor(props) {
        this.id = props.id;
        this.data = props.data;
        this.error = props.error;
    }
    static create(props) {
        return new ProcessedComponent(props);
    }
}
exports.ProcessedComponent = ProcessedComponent;
class View {
    constructor(props) {
        this.filterSets = [];
        this.view = props.view;
        this.setConfig(props.config);
        this.filterSets = props.filterSets || [];
    }
    static create(props) {
        return new View(props);
    }
    getView() {
        return this.view;
    }
    setConfig(config) {
        this.validateConfig(config);
        this.config = config;
    }
    validateConfig(config) {
        if (!config) {
            throw new view_not_found_error_1.ViewNotFoundError();
        }
        if (!config.version) {
            throw new invalid_view_config_error_1.InvalidViewConfigError("View configuration version is required");
        }
        if (!config.components || config.components.length === 0) {
            throw new invalid_view_config_error_1.InvalidViewConfigError("View configuration must have at least one component");
        }
        for (const component of config.components) {
            this.validateComponent(component);
        }
        this.validateUniqueComponentIds(config.components);
    }
    validateComponent(component) {
        if (!component.id) {
            throw new invalid_view_config_error_1.InvalidViewConfigError("Component must have an id");
        }
        if (!component.formatter) {
            throw new invalid_view_config_error_1.InvalidViewConfigError(`Component ${component.id} must have a formatter`);
        }
        if (!component.datasources || component.datasources.length === 0) {
            throw new invalid_view_config_error_1.InvalidViewConfigError(`Component ${component.id} must have at least one datasource`);
        }
        component.datasources.forEach((datasource, index) => {
            if (!datasource.name) {
                throw new invalid_view_config_error_1.InvalidViewConfigError(`Component ${component.id} datasource ${index} must have a name`);
            }
        });
    }
    validateUniqueComponentIds(components) {
        const ids = components.map((c) => c.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
            throw new invalid_view_config_error_1.InvalidViewConfigError("Component IDs must be unique");
        }
    }
    getComponents() {
        return this.config.components;
    }
    getComponentsToProcess() {
        return this.getComponents();
    }
    setFilterSets(filterSets) {
        this.filterSets = filterSets;
    }
    getFilterSets(sorted) {
        if (!sorted) {
            return this.filterSets;
        }
        return [...this.filterSets]
            .sort((a, b) => {
            const nameA = (a.name || "").trim().toLowerCase();
            const nameB = (b.name || "").trim().toLowerCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        })
            .map((filterSet) => ({
            ...filterSet,
            filters: [...filterSet.filters].sort((a, b) => {
                const nameA = (a.name || "").trim().toLowerCase();
                const nameB = (b.name || "").trim().toLowerCase();
                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            }),
        }));
    }
    getFilterSetByName(filterSetName) {
        return this.filterSets.find((fs) => fs.name === filterSetName);
    }
    getFilterSetByDatasourceConfig(datasourceConfig) {
        if (datasourceConfig.filterSet) {
            const filterSet = this.getFilterSetByName(datasourceConfig.filterSet);
            if (filterSet) {
                return filterSet;
            }
        }
        return this.getDefaultFilterSet();
    }
    getDefaultFilterSet() {
        return this.filterSets.find((filterSet) => filterSet.name === "");
    }
    getFiltersForDatasource(datasourceConfig) {
        const filterSet = this.getFilterSetByDatasourceConfig(datasourceConfig);
        const filtersMap = new Map();
        datasourceConfig.filters?.forEach((filterConfig) => {
            if (filterConfig.defaultValue !== undefined) {
                filtersMap.set(filterConfig.name, {
                    name: filterConfig.name,
                    value: filterConfig.defaultValue,
                });
            }
        });
        filterSet?.filters.forEach((filter) => {
            filtersMap.set(filter.name, filter);
        });
        return filtersMap.size > 0 ? Array.from(filtersMap.values()) : undefined;
    }
    getCacheConfig() {
        const cacheConfig = this.config.cache;
        if (!cacheConfig) {
            return {
                enabled: true,
                tags: [],
            };
        }
        return {
            enabled: cacheConfig.enabled ?? true,
            tags: cacheConfig.tags || [],
        };
    }
    getCompressed() {
        return this.config.compressed ?? false;
    }
}
exports.View = View;
//# sourceMappingURL=view.entity.js.map