"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineChartSchema = exports.barChartSchema = exports.chartDatasetSchema = exports.chartVariationCaptionSchema = exports.chartVariationCaptionDataItemSchema = exports.chartDataSchema = void 0;
const enums_1 = require("../constants/enums");
exports.chartDataSchema = {
    type: "object",
    required: ["data", "backgroundColor"],
    additionalProperties: false,
    properties: {
        data: {
            type: "array",
            items: { type: "number" },
            minItems: 1,
            description: "Array of numeric values for chart data points",
        },
        backgroundColor: {
            type: "array",
            items: {
                type: "string",
                pattern: enums_1.HEX_COLOR_PATTERN,
            },
            minItems: 1,
            description: "Array of hex colors for chart bars/elements",
        },
        secondaryBackgroundColor: {
            type: "array",
            items: {
                type: "string",
                pattern: enums_1.HEX_COLOR_PATTERN,
            },
            description: "Array of secondary hex colors (for selected state)",
        },
    },
    description: "Chart data structure with values and colors",
};
exports.chartVariationCaptionDataItemSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        value: {
            type: "string",
            description: "Formatted value (e.g., '5.2', '-22.1', '-')",
        },
        color: {
            type: "string",
            oneOf: [
                { type: "string", pattern: enums_1.HEX_COLOR_PATTERN },
                { type: "string", pattern: "^rgba\\(.*\\)$" },
                { type: "string", const: "" },
            ],
            description: "Color in hexadecimal format, rgba format, or empty string",
        },
        measure: {
            type: "string",
            description: "Unit of measure (e.g., '%', 'pp')",
        },
    },
    description: "Single variation caption data item",
};
exports.chartVariationCaptionSchema = {
    type: "object",
    required: ["title", "data"],
    additionalProperties: false,
    properties: {
        title: {
            type: "string",
            description: "Variation caption title (e.g., 'vs LY')",
        },
        data: {
            oneOf: [
                {
                    type: "array",
                    items: exports.chartVariationCaptionDataItemSchema,
                    description: "Array of variation caption data items (can be empty)",
                },
                exports.chartVariationCaptionDataItemSchema,
            ],
            description: "Array of variation caption data items or single item object",
        },
    },
    description: "Variation caption structure for charts",
};
exports.chartDatasetSchema = {
    type: "object",
    required: ["data", "type"],
    additionalProperties: true,
    properties: {
        data: {
            oneOf: [
                {
                    type: "array",
                    items: { type: "number" },
                    description: "Array of numeric values for chart data points (can be empty)",
                },
                {
                    type: "number",
                    description: "Single numeric value for chart data point (line charts with single point)",
                },
            ],
        },
        type: {
            type: "string",
            enum: ["bar", "line"],
            description: "Chart type",
        },
        label: {
            type: "string",
            description: "Dataset label (e.g., 'Current Year', 'Previous Year')",
        },
        borderColor: {
            oneOf: [
                { type: "string", pattern: enums_1.HEX_COLOR_PATTERN },
                { type: "string", pattern: "^rgba\\(.*\\)$" },
            ],
            description: "Border color in hex or rgba format",
        },
        backgroundColor: {
            oneOf: [
                {
                    type: "array",
                    items: {
                        oneOf: [
                            { type: "string", pattern: enums_1.HEX_COLOR_PATTERN },
                            { type: "string", pattern: "^rgba\\(.*\\)$" },
                        ],
                    },
                },
                {
                    oneOf: [
                        { type: "string", pattern: enums_1.HEX_COLOR_PATTERN },
                        { type: "string", pattern: "^rgba\\(.*\\)$" },
                    ],
                },
            ],
            description: "Background color(s) in hex or rgba format (array for bar, single for line)",
        },
    },
    description: "Chart dataset structure",
};
exports.barChartSchema = {
    type: "object",
    required: ["datasets", "type", "labels"],
    additionalProperties: true,
    properties: {
        datasets: {
            type: "array",
            items: exports.chartDatasetSchema,
            minItems: 1,
            description: "Array of chart datasets",
        },
        type: {
            type: "string",
            const: "bar",
            description: "Chart type (must be 'bar')",
        },
        comparison_unit_of_measure: {
            type: "string",
            description: "Unit of measure for comparison values",
        },
        labels_type: {
            type: "string",
            description: "Type of labels (e.g., 'year_ini', 'months')",
        },
        formatted_data: {
            type: "boolean",
            description: "Whether data is pre-formatted",
        },
        labels: {
            type: "array",
            items: { type: "string" },
            description: "Array of label strings for chart axes (can be empty)",
        },
        variation_caption: {
            type: "array",
            items: exports.chartVariationCaptionSchema,
            description: "Array of variation captions (can be empty)",
        },
        backgroundColor: {
            type: "array",
            items: {
                type: "string",
                pattern: enums_1.HEX_COLOR_PATTERN,
            },
            description: "Array of background colors in hex format (can be empty)",
        },
        big_number: {
            type: "object",
            description: "Big number component data (validated separately with bigNumberComplexSchema)",
        },
    },
    description: "Bar chart structure with datasets, labels, and variation captions",
};
exports.lineChartSchema = {
    type: "object",
    required: ["datasets", "type", "labels"],
    additionalProperties: false,
    properties: {
        datasets: {
            type: "array",
            items: exports.chartDatasetSchema,
            description: "Array of chart datasets",
        },
        type: {
            type: "string",
            const: "line",
            description: "Chart type (must be 'line')",
        },
        labels_type: {
            type: "string",
            description: "Type of labels (e.g., 'months', 'quarters')",
        },
        referencialUnitMeasure: {
            type: "string",
            description: "Reference unit of measure",
        },
        comparison_unit_of_measure: {
            type: "string",
            description: "Unit of measure for comparison values",
        },
        formatted_data: {
            type: "boolean",
            description: "Whether data is pre-formatted",
        },
        labels: {
            type: "array",
            items: { type: "string" },
            description: "Array of label strings for chart axes",
        },
        variation_caption: {
            type: "array",
            items: exports.chartVariationCaptionSchema,
            description: "Array of variation captions",
        },
        backgroundColor: {
            type: "array",
            items: {
                type: "string",
                pattern: enums_1.HEX_COLOR_PATTERN,
            },
            description: "Array of background colors in hex format",
        },
    },
    description: "Line chart structure with datasets, labels, and variation captions",
};
//# sourceMappingURL=chart.schema.js.map