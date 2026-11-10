"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showGlobalDataHandler = void 0;
const show_global_data_datasets_1 = require("./show-global-data.datasets");
const show_global_data_types_1 = require("./show-global-data.types");
const PRESET_KEY = "show_global_data";
class ShowGlobalDataPresetHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return (0, show_global_data_datasets_1.collectShowGlobalDataDatasetConfigs)(show_global_data_types_1.SHOW_GLOBAL_DATA_SUBJECTS);
    }
    handle(preset, datasets) {
        const values = show_global_data_types_1.SHOW_GLOBAL_DATA_SUBJECTS.map((kpi) => ({
            kpi,
            hasGlobalData: (0, show_global_data_datasets_1.hasGlobalDataForSubject)(datasets, kpi),
        }));
        const value = {
            values,
        };
        return { ...preset, [PRESET_KEY]: value };
    }
}
exports.showGlobalDataHandler = new ShowGlobalDataPresetHandler();
//# sourceMappingURL=show-global-data.handler.js.map