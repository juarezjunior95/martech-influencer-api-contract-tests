"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFilter = withFilter;
function withFilter(filterSets, name, value) {
    const cloned = filterSets.map((fs) => ({
        name: fs.name,
        filters: [...fs.filters],
    }));
    const defaultSet = cloned.find((fs) => fs.name === "");
    if (!defaultSet) {
        cloned.push({ name: "", filters: [{ name, value }] });
        return cloned;
    }
    const filters = new Map(defaultSet.filters.map((f) => [f.name, f]));
    filters.set(name, { name, value });
    defaultSet.filters = [...filters.values()];
    return cloned;
}
//# sourceMappingURL=power-book-filters.js.map