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
var ProcessPresetUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPresetUseCase = void 0;
const common_1 = require("@nestjs/common");
const preset_entity_1 = require("../../domain/entities/preset.entity");
let ProcessPresetUseCase = ProcessPresetUseCase_1 = class ProcessPresetUseCase {
    constructor(presetConfigRepository, presetRepository, formatterRepository) {
        this.presetConfigRepository = presetConfigRepository;
        this.presetRepository = presetRepository;
        this.formatterRepository = formatterRepository;
        this.logger = new common_1.Logger(ProcessPresetUseCase_1.name);
    }
    async execute(presetName, filters) {
        const preset = await this.createPresetEntity(presetName, filters);
        return this.processPresetEntity(preset);
    }
    async createPresetEntity(presetName, filters) {
        const config = await this.presetConfigRepository.getByName(presetName);
        return preset_entity_1.Preset.create({ name: presetName, config, filters });
    }
    async processPresetEntity(preset) {
        const presetName = preset.getName();
        const refs = preset.getPresetRefs();
        const responses = await Promise.all(refs.map((ref) => this.presetRepository.getPreset(ref, preset.getFiltersFor(ref))));
        const rawData = refs.length === 1
            ? responses[0]
            : refs.reduce((acc, ref, idx) => {
                acc[ref] = responses[idx][ref];
                return acc;
            }, {});
        let data = await this.applyPerRefFormatters(preset, refs, rawData);
        const formatter = preset.getFormatter();
        if (formatter) {
            data = await this.formatterRepository.format(formatter, data);
        }
        this.logger.log(`Preset '${presetName}' processed`);
        return { name: presetName, data };
    }
    async applyPerRefFormatters(preset, refs, merged) {
        if (!refs.some((ref) => preset.getRefFormatter(ref))) {
            return merged;
        }
        let data = { ...merged };
        for (const ref of refs) {
            const fmt = preset.getRefFormatter(ref);
            if (!fmt)
                continue;
            const branch = data[ref];
            if (branch === undefined)
                continue;
            const formatted = await this.formatterRepository.format(fmt, {
                [ref]: branch,
            });
            const next = { ...data };
            delete next[ref];
            data = { ...next, ...formatted };
        }
        return data;
    }
};
exports.ProcessPresetUseCase = ProcessPresetUseCase;
exports.ProcessPresetUseCase = ProcessPresetUseCase = ProcessPresetUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IPresetConfigRepository")),
    __param(1, (0, common_1.Inject)("IPresetRepository")),
    __param(2, (0, common_1.Inject)("IPresetFormatterRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProcessPresetUseCase);
//# sourceMappingURL=process-preset.usecase.js.map