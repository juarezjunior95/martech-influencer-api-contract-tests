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
var FetchPresetUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPresetUseCase = void 0;
const common_1 = require("@nestjs/common");
const preset_factory_1 = require("../../domain/factories/preset.factory");
let FetchPresetUseCase = FetchPresetUseCase_1 = class FetchPresetUseCase {
    constructor(presetFactory, userRepository) {
        this.presetFactory = presetFactory;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(FetchPresetUseCase_1.name);
    }
    async execute({ presetName, filters }) {
        try {
            const [preset, user] = await Promise.all([
                this.presetFactory.create(presetName),
                this.userRepository.getCurrentUser(),
            ]);
            const data = await preset.fetch(filters, user ?? undefined);
            this.logger.log(`Preset '${presetName}' fetched successfully`);
            return data;
        }
        catch (error) {
            this.logger.error(`Failed to fetch preset ${presetName}: ${error.message}`);
            throw error;
        }
    }
};
exports.FetchPresetUseCase = FetchPresetUseCase;
exports.FetchPresetUseCase = FetchPresetUseCase = FetchPresetUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("PresetFactory")),
    __param(1, (0, common_1.Inject)("IUserRepository")),
    __metadata("design:paramtypes", [preset_factory_1.PresetFactory, Object])
], FetchPresetUseCase);
//# sourceMappingURL=fetch-preset.usecase.js.map