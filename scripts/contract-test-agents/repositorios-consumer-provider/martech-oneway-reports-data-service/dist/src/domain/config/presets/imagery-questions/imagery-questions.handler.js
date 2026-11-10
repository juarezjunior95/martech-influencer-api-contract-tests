"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageryQuestionsHandler = exports.IMAGERY_DATASET_FUNCTION_NAME = exports.IMAGERY_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
exports.IMAGERY_DATASET_ID = "imagery";
exports.IMAGERY_DATASET_FUNCTION_NAME = "3_portfolio_brand_brand-power-drivers_imageries_imagery-attributes";
function pickImagery(row) {
    const value = row.imagery ??
        row.IMAGERY ??
        row.imagery_attribute ??
        row.imagery_attributes ??
        row.IMAGERY_ATTRIBUTE ??
        row.IMAGERY_ATTRIBUTES ??
        row.level_4 ??
        row.LEVEL_4 ??
        "";
    return typeof value === "string" ? value.trim() : "";
}
class ImageryPresetHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return [
            {
                id: exports.IMAGERY_DATASET_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                    functionName: exports.IMAGERY_DATASET_FUNCTION_NAME,
                    parameters: ["country", "subbrand", "dt_end"],
                }),
            },
        ];
    }
    handle(preset, datasets) {
        const tuples = this.extractTuples(datasets);
        const imageryValue = {
            values: tuples,
            default: tuples.length > 0 ? { ...tuples[0] } : {},
            enabled: true,
        };
        return { ...preset, imagery_questions: imageryValue };
    }
    extractTuples(datasets) {
        const dataset = datasets?.find((d) => d.id === exports.IMAGERY_DATASET_ID);
        if (!dataset?.data?.length) {
            return [];
        }
        const seen = new Set();
        const tuples = [];
        for (const raw of dataset.data) {
            const imagery = pickImagery(raw);
            if (!imagery || seen.has(imagery)) {
                continue;
            }
            seen.add(imagery);
            tuples.push({ value: imagery, label: imagery });
        }
        tuples.sort((a, b) => a.label.localeCompare(b.label));
        return tuples;
    }
}
exports.imageryQuestionsHandler = new ImageryPresetHandler();
//# sourceMappingURL=imagery-questions.handler.js.map