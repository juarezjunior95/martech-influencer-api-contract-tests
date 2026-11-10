"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.volumeBigNumbersSchema = exports.volumeBigNumbersArraySchema = exports.volumeBigNumberCardSchema = exports.volumeBigNumberDataItemSchema = void 0;
const enums_1 = require("../constants/enums");
exports.volumeBigNumberDataItemSchema = {
    type: "object",
    required: ["bigNumber", "comparison"],
    additionalProperties: false,
    properties: {
        bigNumber: {
            type: "object",
            required: ["value", "measure"],
            additionalProperties: false,
            properties: {
                value: {
                    type: "string",
                    description: "Formatted numeric value (e.g., '5.2', '-22.1', '-')",
                },
                measure: {
                    type: "string",
                    enum: enums_1.UNIT_OF_MEASURE,
                    description: "Unit of measure for the big number (%, pp, etc)",
                },
                trend: {
                    type: "string",
                    enum: ["positive", "negative"],
                    description: "Trend indicator (optional)",
                },
            },
        },
        secondaryInfo: {
            type: "object",
            required: ["value"],
            additionalProperties: false,
            properties: {
                value: {
                    type: "string",
                    description: "Secondary info value (e.g., '5,573.4', '-')",
                },
                label: {
                    type: "string",
                    description: "Label for secondary info (e.g., '[ % ]')",
                },
            },
            description: "Optional secondary information (only for first comparison item)",
        },
        comparison: {
            type: "object",
            required: ["value"],
            additionalProperties: false,
            properties: {
                label: {
                    type: "string",
                    description: "Comparison label (e.g., 'vs')",
                },
                value: {
                    type: "string",
                    description: "Comparison value (e.g., 'LY', 'BU')",
                },
            },
        },
    },
    description: "Volume Performance Tool data item format - secondaryInfo is optional",
};
exports.volumeBigNumberCardSchema = {
    type: "object",
    required: ["header", "data"],
    additionalProperties: false,
    properties: {
        period_type: {
            type: "string",
            description: "Canonical period type for the card (e.g., 'YTD', 'R3M', 'MTH', 'H1', 'Q2', 'FY')",
        },
        header: {
            type: "object",
            required: ["title", "measure"],
            additionalProperties: false,
            properties: {
                title: {
                    type: "string",
                    description: "Card title (e.g., 'Volume YTD', 'Volume L3M')",
                },
                measure: {
                    type: "string",
                    description: "Unit of measure (e.g., '[ k hl ]')",
                },
            },
        },
        data: {
            type: "array",
            items: exports.volumeBigNumberDataItemSchema,
            description: "Array of data items (can be empty, typically 0 or 2 items)",
        },
    },
    description: "Volume Performance Tool card format",
};
exports.volumeBigNumbersArraySchema = {
    type: "array",
    items: exports.volumeBigNumberCardSchema,
    minItems: 3,
    maxItems: 3,
    description: "Array of 3 volume performance tool big-number cards",
};
const periodAwareVolumeBigNumbersArraySchema = {
    type: "array",
    items: {
        ...exports.volumeBigNumberCardSchema,
        required: ["period_type", "header", "data"],
    },
    minItems: 1,
    maxItems: 3,
    description: "Array of period-aware volume big-number cards (1 for FY, 2 for HALF/QTR, 3 for YTD/R3M/MTH)",
};
exports.volumeBigNumbersSchema = {
    anyOf: [exports.volumeBigNumbersArraySchema, periodAwareVolumeBigNumbersArraySchema],
    description: "Volume big numbers data - legacy 3-card arrays or period-aware arrays",
};
//# sourceMappingURL=volumeBigNumber.schema.js.map