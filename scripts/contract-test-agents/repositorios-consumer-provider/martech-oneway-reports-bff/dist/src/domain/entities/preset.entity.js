"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preset = void 0;
const preset_not_found_error_1 = require("../exceptions/preset-not-found.error");
const invalid_preset_config_error_1 = require("../exceptions/invalid-preset-config.error");
class Preset {
    constructor(props) {
        this.validateConfig(props.config);
        this.name = props.name;
        this.config = props.config;
        this.filters = props.filters ?? [];
    }
    static create(props) {
        return new Preset(props);
    }
    getName() {
        return this.name;
    }
    getPresetRefs() {
        const ref = this.config.preset;
        if (typeof ref === "string") {
            return [ref];
        }
        if (Array.isArray(ref)) {
            return [...ref];
        }
        return Object.keys(ref);
    }
    getFiltersFor(ref) {
        const cfg = this.config.preset;
        if (typeof cfg === "string" || Array.isArray(cfg)) {
            return this.filters;
        }
        const fixedRaw = cfg[ref]?.filters ?? [];
        if (fixedRaw.length === 0) {
            return this.filters;
        }
        const fixed = fixedRaw.map((f) => ({
            namespace: ref,
            name: f.name,
            value: f.value,
        }));
        const keyOf = (f) => `${f.namespace ?? "filter"}::${f.name}`;
        const overridden = new Set(this.filters.map(keyOf));
        const fixedKept = fixed.filter((f) => !overridden.has(keyOf(f)));
        return [...fixedKept, ...this.filters];
    }
    getFormatter() {
        return this.config.formatter;
    }
    getRefFormatter(ref) {
        const cfg = this.config.preset;
        if (typeof cfg === "string" || Array.isArray(cfg)) {
            return undefined;
        }
        return cfg[ref]?.formatter;
    }
    getFilters() {
        return this.filters;
    }
    getSortedFilters() {
        return [...this.filters].sort((a, b) => {
            const nsA = (a.namespace || "filter").toLowerCase();
            const nsB = (b.namespace || "filter").toLowerCase();
            if (nsA !== nsB) {
                return nsA < nsB ? -1 : 1;
            }
            const nameA = (a.name || "").toLowerCase();
            const nameB = (b.name || "").toLowerCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });
    }
    getCacheConfig() {
        if (!this.config.cache) {
            return { enabled: true, tags: [] };
        }
        return {
            enabled: this.config.cache.enabled ?? true,
            tags: this.config.cache.tags ?? [],
        };
    }
    validateConfig(config) {
        if (!config) {
            throw new preset_not_found_error_1.PresetNotFoundError();
        }
        if (!config.version) {
            throw new invalid_preset_config_error_1.InvalidPresetConfigError("Preset configuration version is required");
        }
        const ref = config.preset;
        const isValidRef = (() => {
            if (ref && typeof ref === "object") {
                const keys = Object.keys(ref);
                return keys.length > 0 && keys.every((k) => k.length > 0);
            }
            return false;
        })();
        if (!isValidRef) {
            throw new invalid_preset_config_error_1.InvalidPresetConfigError("Preset configuration must have a `preset` reference (string, non-empty string[], or non-empty Record<string, PresetRefConfig>)");
        }
    }
}
exports.Preset = Preset;
//# sourceMappingURL=preset.entity.js.map