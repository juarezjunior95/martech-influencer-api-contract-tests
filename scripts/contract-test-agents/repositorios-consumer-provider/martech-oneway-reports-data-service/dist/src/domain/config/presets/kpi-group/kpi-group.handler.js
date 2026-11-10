"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kpiGroupHandler = void 0;
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const kpi_group_types_1 = require("./kpi-group.types");
class KpiGroupHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return [
            {
                id: kpi_group_types_1.KPI_GROUP_DATASET_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                    query: kpi_group_types_1.KPI_GROUP_DATASET_QUERY,
                }),
            },
        ];
    }
    handle(preset, datasets) {
        const rows = this.extractRows(datasets);
        const queried = this.buildMap(rows);
        const result = {};
        for (const [key, value] of Object.entries(preset)) {
            if ((0, kpi_group_types_1.isKpiGroupFilterItem)(value)) {
                continue;
            }
            result[key] = value;
        }
        for (const [key, value] of Object.entries(queried)) {
            result[key] = value;
        }
        return result;
    }
    extractRows(datasets) {
        const dataset = datasets?.find((d) => d.id === kpi_group_types_1.KPI_GROUP_DATASET_ID);
        return dataset?.data ?? [];
    }
    buildMap(rows) {
        const out = {};
        for (const raw of rows) {
            const name = this.pick(raw, ["kpi_name", "KPI_NAME"]);
            const value = this.pick(raw, ["time_frame", "TIME_FRAME"]);
            if (!name || !value) {
                continue;
            }
            out[name] = this.toConfigValue(name, value);
        }
        return out;
    }
    toConfigValue(name, value) {
        if (kpi_group_types_1.KPI_GROUP_NUMERIC_KEYS.has(name)) {
            const n = Number(value);
            return Number.isFinite(n) ? n : value;
        }
        return value;
    }
    pick(row, keys) {
        for (const key of keys) {
            const v = row[key];
            if (typeof v === "string" && v.length > 0) {
                return v;
            }
        }
        return "";
    }
}
exports.kpiGroupHandler = new KpiGroupHandler();
//# sourceMappingURL=kpi-group.handler.js.map