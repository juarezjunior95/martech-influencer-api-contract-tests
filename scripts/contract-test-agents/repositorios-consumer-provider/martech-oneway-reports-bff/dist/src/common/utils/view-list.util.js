"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupedAvailableViews = getGroupedAvailableViews;
exports.getAllAvailableViews = getAllAvailableViews;
exports.generateViewsDescription = generateViewsDescription;
const config_tree_listing_util_1 = require("./config-tree-listing.util");
function extractFilterGroups(config) {
    if (config.filters &&
        typeof config.filters === "object" &&
        !Array.isArray(config.filters)) {
        const groups = {};
        for (const [groupName, groupFilters] of Object.entries(config.filters)) {
            if (Array.isArray(groupFilters)) {
                groups[groupName] = groupFilters.map((f) => ({ name: f.name }));
            }
        }
        if (Object.keys(groups).length === 0) {
            return undefined;
        }
        return groups;
    }
    if (config.filters && Array.isArray(config.filters)) {
        const filters = config.filters.map((f) => ({
            name: f.name,
        }));
        if (filters.length > 0) {
            return { default: filters };
        }
    }
    return undefined;
}
function formatFilterGroup(groupName, filters) {
    if (!filters || filters.length === 0) {
        return "";
    }
    const filterText = filters.map((f) => `<code>${f.name}</code>`).join(", ");
    const groupLabel = groupName === "default" ? "Default" : groupName;
    return `<strong>${groupLabel}</strong>: ${filterText}`;
}
function formatViewMeta(config) {
    const filterGroups = extractFilterGroups(config);
    if (!filterGroups || Object.keys(filterGroups).length === 0) {
        return "";
    }
    const groupNames = Object.keys(filterGroups);
    if (groupNames.length === 1 && groupNames[0] === "default") {
        const filterText = filterGroups.default
            .map((f) => `<code>${f.name}</code>`)
            .join(", ");
        return ` <em>(${filterText})</em>`;
    }
    const groupTexts = groupNames.map((groupName) => formatFilterGroup(groupName, filterGroups[groupName]));
    return ` <em>(${groupTexts.join(" | ")})</em>`;
}
const viewListingOptions = {
    configDirName: "views",
    fileSuffix: ".view.js",
    heading: "Available Datasource Views",
    introText: "The following datasource views are available:",
    formatMeta: formatViewMeta,
};
function getGroupedAvailableViews() {
    return (0, config_tree_listing_util_1.getGroupedConfigTree)(viewListingOptions);
}
function getAllAvailableViews() {
    return (0, config_tree_listing_util_1.getAllItemNames)(getGroupedAvailableViews());
}
function generateViewsDescription() {
    return (0, config_tree_listing_util_1.generateConfigTreeDescription)(viewListingOptions);
}
//# sourceMappingURL=view-list.util.js.map