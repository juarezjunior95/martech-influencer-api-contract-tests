"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalBigNumbersSchema = exports.generalBigNumbersArraySchema = exports.generalBigNumberCardSchema = exports.generalBigNumberDataItemSchema = void 0;
const enums_1 = require("../constants/enums");
exports.generalBigNumberDataItemSchema = {
    type: "object",
    required: ["bigNumber", "secondaryInfo", "comparison"],
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
                    description: "Comparison value (e.g., 'vs LY')",
                },
            },
        },
    },
    description: "Performance Tool data item format",
};
exports.generalBigNumberCardSchema = {
    type: "object",
    required: ["header", "data"],
    additionalProperties: false,
    properties: {
        header: {
            type: "object",
            required: ["title", "measure"],
            additionalProperties: false,
            properties: {
                title: {
                    type: "string",
                    description: "Card title (e.g., 'Power YTD')",
                },
                measure: {
                    type: "string",
                    description: "Unit of measure (e.g., '[ % ]')",
                },
            },
        },
        data: {
            type: "array",
            items: exports.generalBigNumberDataItemSchema,
            description: "Array of data items (can be empty)",
        },
    },
    description: "Performance Tool card format",
};
exports.generalBigNumbersArraySchema = {
    type: "array",
    items: exports.generalBigNumberCardSchema,
    minItems: 1,
    description: "Array of performance tool big number cards",
};
exports.generalBigNumbersSchema = {
    oneOf: [exports.generalBigNumbersArraySchema],
    description: "general big numbers data - array of cards",
};
//# sourceMappingURL=generalBigNumbers.schema.js.map