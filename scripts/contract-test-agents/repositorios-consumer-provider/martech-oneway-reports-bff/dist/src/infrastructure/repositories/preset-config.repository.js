"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var PresetConfigRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetConfigRepository = void 0;
const common_1 = require("@nestjs/common");
const invalid_preset_config_error_1 = require("../../domain/exceptions/invalid-preset-config.error");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const module_1 = require("module");
const PRESET_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
let PresetConfigRepository = PresetConfigRepository_1 = class PresetConfigRepository {
    constructor() {
        this.logger = new common_1.Logger(PresetConfigRepository_1.name);
        this.require = (0, module_1.createRequire)(__filename);
        this.presetsPath = path.join(process.cwd(), "dist", "src", "domain", "config", "presets");
    }
    async getByName(presetName) {
        try {
            const formattedName = this.formatPresetName(presetName);
            const configPath = this.resolveConfigPath(formattedName);
            if (!configPath) {
                this.logger.warn(`Preset configuration not found for: ${presetName}`);
                return null;
            }
            if (process.env.NODE_ENV === "development") {
                delete this.require.cache[this.require.resolve(configPath)];
            }
            const configData = this.require(configPath);
            return configData.default || configData;
        }
        catch (error) {
            if (error instanceof invalid_preset_config_error_1.InvalidPresetConfigError) {
                throw error;
            }
            this.logger.error(`Error loading preset configuration for ${presetName}: ${error.message}`);
            return null;
        }
    }
    resolveConfigPath(formattedName) {
        const leaf = path.basename(formattedName);
        const folderPath = path.join(this.presetsPath, formattedName, `${leaf}.preset.js`);
        if (fs.existsSync(folderPath)) {
            return folderPath;
        }
        const flatPath = path.join(this.presetsPath, `${formattedName}.preset.js`);
        if (fs.existsSync(flatPath)) {
            return flatPath;
        }
        return null;
    }
    formatPresetName(presetName) {
        if (!PRESET_NAME_PATTERN.test(presetName)) {
            throw new invalid_preset_config_error_1.InvalidPresetConfigError(`Invalid preset name: ${presetName}`);
        }
        return presetName.replaceAll("_", "/");
    }
};
exports.PresetConfigRepository = PresetConfigRepository;
exports.PresetConfigRepository = PresetConfigRepository = PresetConfigRepository_1 = __decorate([
    (0, common_1.Injectable)()
], PresetConfigRepository);
//# sourceMappingURL=preset-config.repository.js.map