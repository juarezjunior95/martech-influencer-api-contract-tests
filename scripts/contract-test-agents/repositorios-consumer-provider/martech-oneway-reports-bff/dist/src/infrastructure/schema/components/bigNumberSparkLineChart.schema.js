"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigNumberSparkLineChartSchema = exports.bigNumberDataItemSchema = exports.bigNumberDemographicSchema = exports.bigNumberSecondaryInfoSchema = exports.bigNumberComparisonSchema = exports.bigNumberValueSchema = exports.bigNumberPeriodSchema = void 0;
const enums_1 = require("../constants/enums");
const TREND_VALUES = ["positive", "negative"];
exports.bigNumberPeriodSchema = {
    type: "object",
    required: ["label", "value"],
    additionalProperties: false,
    properties: {
        label: {
            type: "string",
            description: "Period label",
        },
        value: {
            type: "string",
            description: "Period value",
        },
    },
    description: "BigNumber period structure",
};
exports.bigNumberValueSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        value: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "BigNumber value (string or number)",
        },
        measure: {
            type: "string",
            description: "Unit of measure (e.g., '%', 'pp')",
        },
        color: {
            type: "string",
            pattern: enums_1.HEX_COLOR_PATTERN,
            description: "Color in hexadecimal format",
        },
        trend: {
            type: "string",
            enum: TREND_VALUES,
            description: "Trend direction (positive/negative)",
        },
    },
    description: "BigNumber value structure",
};
exports.bigNumberComparisonSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        number: {
            type: "object",
            additionalProperties: false,
            properties: {
                value: {
                    type: "string",
                    description: "Comparison number value",
                },
                measure: {
                    type: "string",
                    description: "Comparison unit of measure",
                },
                color: {
                    type: "string",
                    pattern: enums_1.HEX_COLOR_PATTERN,
                    description: "Color in hexadecimal format",
                },
                trend: {
                    type: "string",
                    enum: TREND_VALUES,
                    description: "Trend direction (positive/negative)",
                },
            },
            description: "Comparison number object",
        },
        label: {
            type: "string",
            description: "Comparison label (e.g., 'vs')",
        },
        value: {
            type: "string",
            description: "Comparison value (e.g., 'LY')",
        },
    },
    description: "BigNumber comparison structure",
};
exports.bigNumberSecondaryInfoSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        value: {
            type: "string",
            description: "Secondary info value",
        },
        measure: {
            type: "string",
            description: "Secondary info unit of measure",
        },
        label: {
            type: "string",
            description: "Secondary info label (e.g., '[ Mio ]')",
        },
        period: exports.bigNumberPeriodSchema,
    },
    description: "BigNumber secondary info structure",
};
exports.bigNumberDemographicSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        gender: {
            type: "array",
            items: { type: "string" },
            description: "Gender demographic filter",
        },
        age: {
            type: "array",
            items: { type: "string" },
            description: "Age demographic filter",
        },
        incomeBracket: {
            type: "array",
            items: { type: "string" },
            description: "Income bracket demographic filter",
        },
    },
    description: "BigNumber demographic/audience structure",
};
exports.bigNumberDataItemSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        audience: exports.bigNumberDemographicSchema,
        bigNumber: exports.bigNumberValueSchema,
        comparison: exports.bigNumberComparisonSchema,
        secondaryInfo: exports.bigNumberSecondaryInfoSchema,
    },
    description: "BigNumber data item structure",
};
exports.bigNumberSparkLineChartSchema = {
    type: "object",
    required: ["chartTitle", "chartPeriod", "bigNumberData", "chartLineData"],
    additionalProperties: false,
    properties: {
        chartTitle: {
            type: "string",
            minLength: 1,
            description: "Chart title",
        },
        chartPeriod: {
            type: "string",
            description: 'Chart period label (e.g., "Dec\'25 - YTD")',
        },
        bigNumberData: {
            type: "array",
            items: exports.bigNumberDataItemSchema,
            minItems: 1,
            description: "Array of BigNumber data items",
        },
        chartLineData: {
            type: "array",
            items: { type: "number" },
            description: "Array of numeric values for sparkline chart",
        },
    },
    description: "BigNumber SparkLine Chart Card structure for Trade Execution Home",
};
//# sourceMappingURL=bigNumberSparkLineChart.schema.js.map