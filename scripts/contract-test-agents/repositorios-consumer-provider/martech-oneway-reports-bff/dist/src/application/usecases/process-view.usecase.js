"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProcessViewUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessViewUseCase = void 0;
const common_1 = require("@nestjs/common");
const view_entity_1 = require("../../domain/entities/view.entity");
let ProcessViewUseCase = ProcessViewUseCase_1 = class ProcessViewUseCase {
    constructor(viewConfigRepository, dataRepository, formatterRepository) {
        this.viewConfigRepository = viewConfigRepository;
        this.dataRepository = dataRepository;
        this.formatterRepository = formatterRepository;
        this.logger = new common_1.Logger(ProcessViewUseCase_1.name);
    }
    async execute(view, filterSets) {
        const viewEntity = await this.createViewEntity(view, filterSets);
        return this.processViewEntity(viewEntity);
    }
    async createViewEntity(view, filterSets) {
        const config = await this.viewConfigRepository.getByName(view);
        return view_entity_1.View.create({ view, config, filterSets });
    }
    async processViewEntity(viewEntity) {
        const viewName = viewEntity.getView();
        const processedComponents = await this.processComponents(viewEntity);
        const componentCount = processedComponents.length;
        const errorCount = processedComponents.filter((c) => c.error).length;
        this.logger.log(`View '${viewName}' processed: ${componentCount} components (${errorCount} errors)`);
        return {
            view: viewName,
            components: processedComponents,
            compressed: viewEntity.getCompressed(),
        };
    }
    async processComponents(viewEntity) {
        return Promise.all(viewEntity.getComponentsToProcess().map(async (componentConfig) => {
            try {
                const data = await this.processComponentData(componentConfig, viewEntity);
                return view_entity_1.ProcessedComponent.create({
                    id: componentConfig.id,
                    data,
                });
            }
            catch (error) {
                this.logger.error(`Failed to process component '${componentConfig.id}' of view '${viewEntity.getView()}': ${error.message}`);
                return view_entity_1.ProcessedComponent.create({
                    id: componentConfig.id,
                    error: error.response?.data?.message || error.message,
                });
            }
        }));
    }
    async processComponentData(componentConfig, viewEntity) {
        const componentDatasourcesData = await this.loadComponentDatasources(componentConfig, viewEntity);
        const data = await this.applyComponentFormatter(componentConfig, componentDatasourcesData, viewEntity);
        return data;
    }
    async loadComponentDatasources(componentConfig, viewEntity) {
        return Promise.all(componentConfig.datasources.map(async (datasourceConfig) => {
            const filters = viewEntity.getFiltersForDatasource(datasourceConfig);
            const data = await this.dataRepository.getData(datasourceConfig.name, filters);
            data.title = datasourceConfig.title;
            return data;
        }));
    }
    async applyComponentFormatter(componentConfig, componentDatasourcesData, viewEntity) {
        return this.formatterRepository.format(componentConfig.formatter, componentDatasourcesData, { filters: viewEntity.getDefaultFilterSet()?.filters });
    }
};
exports.ProcessViewUseCase = ProcessViewUseCase;
exports.ProcessViewUseCase = ProcessViewUseCase = ProcessViewUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IViewConfigRepository")),
    __param(1, (0, common_1.Inject)("IDataRepository")),
    __param(2, (0, common_1.Inject)("IFormatterRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProcessViewUseCase);
//# sourceMappingURL=process-view.usecase.js.map