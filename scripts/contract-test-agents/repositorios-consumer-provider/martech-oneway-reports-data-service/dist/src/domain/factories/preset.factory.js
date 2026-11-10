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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetFactory = void 0;
const common_1 = require("@nestjs/common");
const dataset_repository_factory_1 = require("./dataset-repository.factory");
const preset_entity_1 = require("../entities/preset.entity");
let PresetFactory = class PresetFactory {
    constructor(presetConfigRepository, datasetRepositoryFactory) {
        this.presetConfigRepository = presetConfigRepository;
        this.datasetRepositoryFactory = datasetRepositoryFactory;
    }
    async create(presetName) {
        return new preset_entity_1.PresetEntity(this.datasetRepositoryFactory, await this.presetConfigRepository.getByName(presetName), presetName);
    }
};
exports.PresetFactory = PresetFactory;
exports.PresetFactory = PresetFactory = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("PresetConfigRepository")),
    __param(1, (0, common_1.Inject)("DatasetRepositoryFactory")),
    __metadata("design:paramtypes", [Object, dataset_repository_factory_1.DatasetRepositoryFactory])
], PresetFactory);
//# sourceMappingURL=preset.factory.js.map