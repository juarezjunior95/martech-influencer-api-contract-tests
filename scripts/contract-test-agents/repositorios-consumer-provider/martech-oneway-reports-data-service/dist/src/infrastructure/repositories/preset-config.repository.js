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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetConfigRepository = void 0;
const common_1 = require("@nestjs/common");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const file_loader_service_1 = require("../../common/services/file-loader.service");
const PRESET_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
let PresetConfigRepository = class PresetConfigRepository {
    constructor(fileLoaderService) {
        this.fileLoaderService = fileLoaderService;
    }
    async getByName(presetName) {
        return this.fileLoaderService.load(this.getConfigPath(presetName));
    }
    getConfigPath(presetName) {
        if (!PRESET_NAME_PATTERN.test(presetName)) {
            throw new common_1.BadRequestException(`Invalid preset name: ${presetName}`);
        }
        const formattedPath = presetName.replaceAll("_", "/");
        const presetsDir = path_1.default.join(process.cwd(), "dist", "src", "domain", "config", "presets");
        const leaf = path_1.default.basename(formattedPath);
        const folderPath = path_1.default.join(presetsDir, formattedPath, `${leaf}.preset.js`);
        if (fs_1.default.existsSync(folderPath)) {
            return folderPath;
        }
        return path_1.default.join(presetsDir, `${formattedPath}.preset.js`);
    }
};
exports.PresetConfigRepository = PresetConfigRepository;
exports.PresetConfigRepository = PresetConfigRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_loader_service_1.FileLoaderService])
], PresetConfigRepository);
//# sourceMappingURL=preset-config.repository.js.map