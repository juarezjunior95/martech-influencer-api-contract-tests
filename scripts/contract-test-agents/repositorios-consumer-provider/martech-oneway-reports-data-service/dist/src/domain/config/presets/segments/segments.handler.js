"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.segmentsHandler = void 0;
const ALL_SEGMENT = { value: "All", label: "All", full: "" };
const DEFAULT_SEGMENTS = [
    { value: "Core Superiority", label: "Core Superiority", full: "" },
    { value: "Premiumization", label: "Premium", full: "" },
    { value: "Beyond Beer", label: "Beyond Beer", full: "" },
    { value: "NAB", label: "Non-Alcoholic Beer", full: "" },
];
const CATEGORY_HEALTH_SEGMENTS = [
    { value: "Beer", label: "Beer", full: "" },
    { value: "Beyond Beer", label: "Beyond Beer", full: "" },
    { value: "Beer + Beyond Beer", label: "Beer + Beyond Beer", full: "" },
];
const BRAND_POWER_BOOK_SEGMENTS = [
    { value: "Premiumization", label: "Premium", full: "" },
    { value: "Core+", label: "Core+", full: "" },
    { value: "Mainstream", label: "Mainstream", full: "" },
    { value: "Beyond Beer", label: "Beyond Beer", full: "" },
    { value: "Others", label: "Others", full: "" },
];
const AUDIENCE_TARGETING_SEGMENTS = [
    { value: "Beer", label: "Beer", full: "" },
    { value: "Beyond Beer", label: "Beyond Beer", full: "" },
    { value: "Beer + Beyond Beer", label: "Beer + Beyond Beer", full: "" },
];
const POS_TOOL_OVERVIEW_SEGMENTS = [
    { value: "Alcohol", label: "Alcohol", full: "Alcohol" },
    {
        value: "Beer + Beyond Beer",
        label: "Beer + BYB",
        full: "Beer + Beyond Beer",
    },
    { value: "Beer", label: "Beer", full: "Beer" },
    { value: "Beyond Beer", label: "Beyond Beer", full: "Beyond Beer" },
    { value: "Spirits", label: "Spirits", full: "Spirits" },
    { value: "Wine", label: "Wine", full: "Wine" },
];
const SCOPED_SEGMENTS = {
    default: DEFAULT_SEGMENTS,
    category_health: CATEGORY_HEALTH_SEGMENTS,
    brand_power_book: BRAND_POWER_BOOK_SEGMENTS,
    audience_targeting: AUDIENCE_TARGETING_SEGMENTS,
    pos_tool_overview: POS_TOOL_OVERVIEW_SEGMENTS,
};
const NO_DEFAULT_SEGMENT = { value: "", label: "", full: "" };
class SegmentsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const segmentsConfig = (preset.segments ?? {});
        const baseValues = this.buildValues(segmentsConfig.scope);
        const noDefault = this.toBool(segmentsConfig.noDefault);
        const includeAll = this.toBool(segmentsConfig.includeAll);
        let defaultTuple = noDefault || baseValues.length === 0
            ? {
                ...NO_DEFAULT_SEGMENT,
            }
            : { ...baseValues[0] };
        const values = includeAll
            ? [{ ...ALL_SEGMENT }, ...baseValues]
            : baseValues;
        if (includeAll && !noDefault) {
            defaultTuple = { ...ALL_SEGMENT };
        }
        const segmentsValue = {
            values,
            default: defaultTuple,
            enabled: true,
        };
        return { ...preset, segments: segmentsValue };
    }
    buildValues(scope) {
        const registry = this.resolveScope(scope);
        return registry.map((tuple) => ({ ...tuple }));
    }
    resolveScope(scope) {
        if (!scope) {
            return SCOPED_SEGMENTS.default;
        }
        return SCOPED_SEGMENTS[scope.toLowerCase()] ?? SCOPED_SEGMENTS.default;
    }
    toBool(value) {
        if (typeof value === "boolean") {
            return value;
        }
        if (typeof value === "string") {
            return value.toLowerCase() === "true";
        }
        return false;
    }
}
exports.segmentsHandler = new SegmentsPresetHandler();
//# sourceMappingURL=segments.handler.js.map