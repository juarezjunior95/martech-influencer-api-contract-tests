"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBigNumberArraySchema = exports.createBigNumberCardSchema = exports.bigNumberDataSchema = void 0;
const primitives_schema_1 = require("./primitives.schema");
exports.bigNumberDataSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        audience: primitives_schema_1.bigNumberDemographicSchema,
        bigNumber: primitives_schema_1.bigNumberValueSchema,
        comparison: primitives_schema_1.bigNumberComparisonSchema,
        secondaryInfo: primitives_schema_1.bigNumberSecondaryInfoSchema,
    },
    description: "BigNumber data item - core reusable schema",
};
const createBigNumberCardSchema = (options = {}) => {
    const { idEnum, requiredFields = ["bigNumberData"], additionalProperties = {}, description = "BigNumber card schema", dataFieldName = "bigNumberData", minItems, maxItems, includeHasDeepDive = false, } = options;
    const dataArraySchema = {
        type: "array",
        items: exports.bigNumberDataSchema,
        description: "Array of BigNumber data items",
    };
    if (minItems !== undefined) {
        dataArraySchema.minItems = minItems;
    }
    if (maxItems !== undefined) {
        dataArraySchema.maxItems = maxItems;
    }
    const baseProperties = {
        id: idEnum
            ? {
                type: "string",
                enum: idEnum,
                description: "Card identifier",
            }
            : {
                type: "string",
                description: "Card identifier",
            },
        title: {
            type: "string",
            minLength: 1,
            description: "Card title",
        },
        period: {
            type: "string",
            description: 'Formatted period string (e.g., "Q3\'25 - R12M")',
        },
        [dataFieldName]: dataArraySchema,
    };
    if (includeHasDeepDive) {
        baseProperties.hasDeepDive = {
            type: "boolean",
            description: "Indicates if the card has a deep dive feature",
        };
    }
    return {
        type: "object",
        required: requiredFields,
        additionalProperties: false,
        properties: {
            ...baseProperties,
            ...additionalProperties,
        },
        description,
    };
};
exports.createBigNumberCardSchema = createBigNumberCardSchema;
const createBigNumberArraySchema = (cardSchema, options = {}) => {
    const { minItems, maxItems, description = "Array of BigNumber cards", } = options;
    const schema = {
        type: "array",
        items: cardSchema,
        description,
    };
    if (minItems !== undefined) {
        schema.minItems = minItems;
    }
    if (maxItems !== undefined) {
        schema.maxItems = maxItems;
    }
    return schema;
};
exports.createBigNumberArraySchema = createBigNumberArraySchema;
//# sourceMappingURL=bigNumberData.schema.js.map