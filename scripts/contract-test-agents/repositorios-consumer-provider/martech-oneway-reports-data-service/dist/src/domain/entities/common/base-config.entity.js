"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseConfigEntity = void 0;
const missing_required_filter_error_1 = require("../../exceptions/missing-required-filter.error");
class BaseConfigEntity {
    constructor(datasetRepositoryFactory, config, name) {
        this.datasetRepositoryFactory = datasetRepositoryFactory;
        this.name = name;
        this.config = config;
    }
    getName() {
        return this.name;
    }
    validateRequiredFilters(filters) {
        if (!this.config?.filters || this.config.filters.length === 0) {
            return;
        }
        const providedFilterNames = new Set(filters.map((filter) => filter.name));
        for (const filterConfig of this.config.filters) {
            if (filterConfig.required === false) {
                continue;
            }
            if (!providedFilterNames.has(filterConfig.name)) {
                throw new missing_required_filter_error_1.MissingRequiredFilterError(filterConfig.name, this.getName());
            }
        }
    }
    async loadDatasets(filters) {
        this.validateRequiredFilters(filters);
        const datasets = [];
        if (!this.config?.datasets || this.config.datasets.length === 0) {
            return datasets;
        }
        for (const datasetConfig of this.config.datasets) {
            const repository = this.datasetRepositoryFactory.resolveRepository(datasetConfig.config.type);
            const data = await repository.fetchData(datasetConfig.config, filters);
            datasets.push({
                id: datasetConfig.id,
                data,
            });
        }
        return datasets;
    }
    getDefaultDataset(datasets) {
        return datasets?.[0];
    }
}
exports.BaseConfigEntity = BaseConfigEntity;
//# sourceMappingURL=base-config.entity.js.map