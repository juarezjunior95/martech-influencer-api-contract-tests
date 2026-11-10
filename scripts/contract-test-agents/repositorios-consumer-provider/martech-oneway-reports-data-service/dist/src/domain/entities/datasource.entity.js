"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasourceEntity = void 0;
const base_config_entity_1 = require("./common/base-config.entity");
class DatasourceEntity extends base_config_entity_1.BaseConfigEntity {
    constructor(datasetRepositoryFactory, datasourceConfig, name) {
        super(datasetRepositoryFactory, datasourceConfig, name);
    }
    async loadDatasets(filters) {
        this.validateRequiredFilters(filters);
        const datasets = [];
        if (!this.config?.datasets || this.config.datasets.length === 0) {
            return datasets;
        }
        for (const datasetConfig of this.config.datasets) {
            const repository = this.datasetRepositoryFactory.resolveRepository(datasetConfig.config.type);
            const data = await repository.fetchData(datasetConfig.config, filters, this.shouldMapEntityBeforeHandler()
                ? this.config?.entityClass
                : undefined);
            datasets.push({
                id: datasetConfig.id,
                data,
            });
        }
        return datasets;
    }
    async fetch(filters) {
        const datasets = await this.loadDatasets(filters);
        const defaultDataset = this.getDefaultDataset(datasets);
        const handled = this.config?.handler
            ? (await this.config.handler?.handle(datasets, defaultDataset)) || []
            : defaultDataset?.data || [];
        if (this.shouldMapEntityAfterHandler()) {
            return handled.map((row) => new this.config.entityClass(row));
        }
        return handled;
    }
    shouldMapEntityBeforeHandler() {
        return (Boolean(this.config?.entityClass) && !this.config?.entityClassAfterHandler);
    }
    shouldMapEntityAfterHandler() {
        return Boolean(this.config?.entityClass && this.config?.entityClassAfterHandler);
    }
}
exports.DatasourceEntity = DatasourceEntity;
//# sourceMappingURL=datasource.entity.js.map