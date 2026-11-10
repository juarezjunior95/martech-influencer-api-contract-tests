"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigNumberComparisonSchema = exports.bigNumberSecondaryInfoSchema = exports.bigNumberPeriodSchema = exports.bigNumberValueSchema = exports.bigNumberDemographicSchema = void 0;
const enums_1 = require("../../constants/enums");
exports.bigNumberDemographicSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        gender: {
            type: "array",
            items: { type: "string" },
            description: "Gender filter values",
        },
        age: {
            type: "array",
            items: { type: "string" },
            description: "Age range filter values",
        },
        incomeBracket: {
            type: "array",
            items: { type: "string" },
            description: "Income bracket filter values",
        },
    },
    description: "Demographic audience segmentation",
};
exports.bigNumberValueSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        value: {
            type: ["string", "number"],
            description: "Main value to display (e.g., '21.1', 4.5, '-')",
        },
        measure: {
            type: "string",
            description: "Unit of measure (e.g., '%', 'pp', 'mm')",
        },
        color: {
            type: "string",
            pattern: enums_1.HEX_COLOR_PATTERN,
            description: "Color in hexadecimal format (e.g., '#007800')",
        },
        trend: {
            type: "string",
            enum: enums_1.TREND_VALUES,
            description: "Trend direction: 'positive' or 'negative'",
        },
    },
    description: "BigNumber main value display",
};
exports.bigNumberPeriodSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        label: {
            type: "string",
            description: "Period label (e.g., 'Q3')",
        },
        value: {
            type: "string",
            description: "Period value (e.g., '2025')",
        },
    },
    description: "Period information with label and value",
};
exports.bigNumberSecondaryInfoSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        value: {
            type: "string",
            description: "Secondary value (e.g., '1,234.5')",
        },
        measure: {
            type: "string",
            description: "Unit of measure (e.g., 'mm', '%')",
        },
        label: {
            type: "string",
            description: "Label for the secondary value (e.g., '[ mm ]')",
        },
        period: exports.bigNumberPeriodSchema,
    },
    description: "Secondary information display",
};
exports.bigNumberComparisonSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        number: {
            ...exports.bigNumberValueSchema,
            description: "Optional BigNumber for comparison value",
        },
        label: {
            type: "string",
            description: "Comparison label (e.g., 'vs')",
        },
        value: {
            type: "string",
            description: "Comparison value (e.g., 'LY', 'YTD')",
        },
    },
    description: "Comparison information with optional BigNumber",
};
//# sourceMappingURL=primitives.schema.js.map