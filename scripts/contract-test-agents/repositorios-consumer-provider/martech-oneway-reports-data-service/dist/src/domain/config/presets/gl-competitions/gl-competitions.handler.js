"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.glCompetitionsHandler = void 0;
const common_1 = require("@nestjs/common");
const VALID_TYPES = new Set(["league", "cup"]);
const FALLBACK_KA_DEFAULT = {
    label: "KA Dashboard",
    value: "channels_cup",
};
function deriveValue(label) {
    return label.toLowerCase().replace(/\s+/g, "_");
}
function division(label) {
    return { label, value: deriveValue(label) };
}
const COMPETITIONS = [
    {
        label: "Premier League",
        value: deriveValue("Premier League"),
        kind: "league",
    },
    {
        label: "Super League",
        value: deriveValue("Super League"),
        kind: "league",
    },
    {
        label: "Megabrands Dashboard",
        value: "megabrands_cup",
        kind: "cup",
        divisions: [division("Country"), division("Brand")],
        default: division("Country"),
    },
    {
        label: "KA Dashboard",
        value: "channels_cup",
        kind: "cup",
        divisions: [division("League A"), division("League B")],
        default: division("League A"),
    },
    {
        label: "BEES Dashboard",
        value: "bees_cup",
        kind: "cup",
        divisions: [division("Acceleration Index"), division("Maturity Index")],
        default: division("Acceleration Index"),
    },
    {
        label: "DTC Dashboard",
        value: "dtc_cup",
        kind: "cup",
    },
];
class GlCompetitionsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const cfg = (preset["gl-competitions"] ?? {});
        const filterType = (cfg.type ?? "").trim();
        if (filterType !== "" && !VALID_TYPES.has(filterType)) {
            throw new common_1.BadRequestException("Invalid filter type. Must be either 'league' or 'cup'.");
        }
        const filtered = filterType
            ? COMPETITIONS.filter((entry) => entry.kind === filterType)
            : COMPETITIONS;
        const values = filtered.map((entry) => this.formatCompetition(entry));
        const defaultValue = this.resolveDefault(filtered, filterType);
        const glCompetitionsValue = {
            values,
            default: defaultValue,
            enabled: true,
        };
        return { ...preset, "gl-competitions": glCompetitionsValue };
    }
    formatCompetition(entry) {
        const out = { label: entry.label, value: entry.value };
        if (entry.divisions && entry.divisions.length > 0) {
            out.divisions = entry.divisions.map((division) => ({ ...division }));
        }
        if (entry.default) {
            out.default = { ...entry.default };
        }
        return out;
    }
    resolveDefault(filtered, filterType) {
        const head = filtered[0];
        if (!head) {
            return {};
        }
        const label = head.label || "KA Dashboard";
        const baseValue = filterType === "" ? "KA Dashboard" : head.value;
        const value = label === "KA Dashboard" ? FALLBACK_KA_DEFAULT.value : baseValue;
        return { label, value };
    }
}
exports.glCompetitionsHandler = new GlCompetitionsPresetHandler();
//# sourceMappingURL=gl-competitions.handler.js.map