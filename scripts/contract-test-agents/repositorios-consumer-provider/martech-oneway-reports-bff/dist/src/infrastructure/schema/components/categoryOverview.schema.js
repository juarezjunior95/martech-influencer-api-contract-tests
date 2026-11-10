"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryOverviewDataSchema = exports.categoryOverviewEmptySchema = exports.categoryOverviewArraySchema = exports.categoryOverviewItemSchema = exports.kpiTableSchema = exports.kpiRowSchema = exports.kpiValueSchema = void 0;
const enums_1 = require("../constants/enums");
exports.kpiValueSchema = {
    type: "object",
    required: ["value"],
    additionalProperties: false,
    properties: {
        value: {
            type: "string",
            description: "Numeric value",
        },
        unitOfMeasure: {
            type: "string",
            enum: enums_1.UNIT_OF_MEASURE,
            description: "Unit of measure (%, pp, etc)",
        },
        direction: {
            type: "string",
            enum: enums_1.VARIATION_DIRECTIONS,
            description: "Direction indicator for variations",
        },
    },
};
exports.kpiRowSchema = {
    type: "object",
    required: ["label"],
    properties: {
        label: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            description: "Row label (P7D, P4W, Vol, etc)",
        },
    },
    patternProperties: {
        [enums_1.DYNAMIC_PROPERTY_PATTERN]: {
            oneOf: [{ type: "string" }, exports.kpiValueSchema],
            description: "Dynamic properties based on header columns",
        },
    },
    additionalProperties: true,
};
exports.kpiTableSchema = {
    type: "object",
    required: ["header", "rows"],
    additionalProperties: false,
    properties: {
        header: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                required: ["id", "title"],
                additionalProperties: false,
                properties: {
                    id: {
                        type: "string",
                        minLength: 0,
                        maxLength: 50,
                        description: "Column identifier (can be empty for label columns)",
                    },
                    title: {
                        type: "string",
                        minLength: 0,
                        maxLength: 100,
                        description: "Column title",
                    },
                },
            },
            description: "Table header definition",
        },
        rows: {
            type: "array",
            minItems: 1,
            items: exports.kpiRowSchema,
            description: "Array of KPI rows",
        },
    },
    description: "KPI table structure with header and rows",
};
exports.categoryOverviewItemSchema = {
    type: "object",
    required: ["title", "kpi"],
    additionalProperties: false,
    properties: {
        title: {
            type: "string",
            minLength: 1,
            maxLength: 200,
            description: "Category title (Beer Participation, Superior Core, Lead Premium, etc)",
        },
        versus: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            description: "Comparison period label (vs Q3'24 YTD, vs Oct'24 YTD, etc)",
        },
        kpi_name: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            description: "KPI identifier (p7d, volume, etc)",
        },
        dateRefresh: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            description: "Last update date or period (Q3'25, Oct'25, etc)",
        },
        kpi: exports.kpiTableSchema,
        footerInfo: {
            type: "string",
            maxLength: 200,
            description: "Optional footer information (Non-Alc Beer, etc)",
        },
        tooltip: {
            type: "string",
            maxLength: 500,
            description: "Tooltip text content",
        },
    },
};
exports.categoryOverviewArraySchema = {
    type: "array",
    items: exports.categoryOverviewItemSchema,
    minItems: 1,
    description: "Array of CategoryOverview items for CategoryGrowthLevers component",
};
exports.categoryOverviewEmptySchema = {
    type: "object",
    required: ["empty"],
    additionalProperties: false,
    properties: {
        empty: {
            type: "boolean",
            const: true,
            description: "Indicates there is no data available",
        },
    },
};
exports.categoryOverviewDataSchema = {
    oneOf: [exports.categoryOverviewArraySchema, exports.categoryOverviewEmptySchema],
    description: "CategoryGrowthLevers data - can be either an array of items or an empty state object",
};
//# sourceMappingURL=categoryOverview.schema.js.map