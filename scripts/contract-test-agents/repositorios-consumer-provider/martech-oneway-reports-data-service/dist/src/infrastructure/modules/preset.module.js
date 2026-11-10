"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetModule = void 0;
const common_1 = require("@nestjs/common");
const common_module_1 = require("../../common/common.module");
const databricks_module_1 = require("./databricks.module");
const dataset_repository_factory_1 = require("../../domain/factories/dataset-repository.factory");
const preset_controller_1 = require("../controllers/preset.controller");
const preset_factory_1 = require("../../domain/factories/preset.factory");
const fetch_preset_usecase_1 = require("../../application/usecases/fetch-preset.usecase");
const preset_config_repository_1 = require("../repositories/preset-config.repository");
const user_repository_1 = require("../repositories/user.repository");
const databricks_data_repository_1 = require("../repositories/databricks-data.repository");
let PresetModule = class PresetModule {
};
exports.PresetModule = PresetModule;
exports.PresetModule = PresetModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule, databricks_module_1.DatabricksModule],
        controllers: [preset_controller_1.PresetController],
        providers: [
            {
                provide: "DatabricksDataRepository",
                useClass: databricks_data_repository_1.DatabricksDataRepository,
            },
            {
                provide: "DatasetRepositoryFactory",
                useClass: dataset_repository_factory_1.DatasetRepositoryFactory,
            },
            {
                provide: "PresetConfigRepository",
                useClass: preset_config_repository_1.PresetConfigRepository,
            },
            {
                provide: "PresetFactory",
                useClass: preset_factory_1.PresetFactory,
            },
            {
                provide: "IUserRepository",
                useClass: user_repository_1.CurrentUserRepository,
            },
            {
                provide: "FetchPresetUseCase",
                useClass: fetch_preset_usecase_1.FetchPresetUseCase,
            },
        ],
    })
], PresetModule);
//# sourceMappingURL=preset.module.js.map