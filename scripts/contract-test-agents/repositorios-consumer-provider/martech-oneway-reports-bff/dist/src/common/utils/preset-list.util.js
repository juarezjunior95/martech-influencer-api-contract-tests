"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupedAvailablePresets = getGroupedAvailablePresets;
exports.getAllAvailablePresets = getAllAvailablePresets;
exports.generatePresetsDescription = generatePresetsDescription;
const config_tree_listing_util_1 = require("./config-tree-listing.util");
function extractRefs(config) {
    const ref = config.preset;
    if (typeof ref === "string") {
        return [{ name: ref }];
    }
    if (Array.isArray(ref)) {
        return ref.map((name) => ({ name }));
    }
    if (ref && typeof ref === "object") {
        return Object.keys(ref).map((name) => ({ name }));
    }
    return [];
}
function formatPresetMeta(config) {
    const parts = [];
    const refs = extractRefs(config);
    if (refs.length > 0) {
        const refsText = refs.map((r) => `<code>${r.name}</code>`).join(", ");
        parts.push(`refs: ${refsText}`);
    }
    if (config.formatter) {
        parts.push(`formatter: <code>${config.formatter}</code>`);
    }
    if (parts.length === 0) {
        return "";
    }
    return ` <em>(${parts.join(" | ")})</em>`;
}
const presetListingOptions = {
    configDirName: "presets",
    fileSuffix: ".preset.js",
    heading: "Available Presets",
    introText: "The following presets are available:",
    formatMeta: formatPresetMeta,
};
function getGroupedAvailablePresets() {
    return (0, config_tree_listing_util_1.getGroupedConfigTree)(presetListingOptions);
}
function getAllAvailablePresets() {
    return (0, config_tree_listing_util_1.getAllItemNames)(getGroupedAvailablePresets());
}
function generatePresetsDescription() {
    return (0, config_tree_listing_util_1.generateConfigTreeDescription)(presetListingOptions);
}
//# sourceMappingURL=preset-list.util.js.map