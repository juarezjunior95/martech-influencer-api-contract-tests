"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakdownTableDataSchema = exports.rowDataItemSchema = exports.cellConfigSchema = exports.chartConfigSchema = exports.columnDefSchema = exports.headerGroupComponentParamsSchema = exports.columnChildSchema = exports.columnConfigSchema = void 0;
const enums_1 = require("../constants/enums");
exports.columnConfigSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        lastColGroup: {
            type: "boolean",
            description: "Indicates if this is the last column group",
        },
        intermediateColGroup: {
            type: "array",
            items: {
                type: "object",
                required: ["initial", "final"],
                additionalProperties: false,
                properties: {
                    initial: {
                        type: "number",
                        minimum: 0,
                        multipleOf: 1,
                        description: "Initial index for intermediate column group",
                    },
                    final: {
                        type: "number",
                        minimum: 0,
                        multipleOf: 1,
                        description: "Final index for intermediate column group",
                    },
                },
            },
            description: "Array of intermediate column group ranges",
        },
        merge: {
            type: "boolean",
            description: "Indicates if column should be merged",
        },
    },
};
exports.columnChildSchema = {
    type: "object",
    required: ["headerName", "field"],
    additionalProperties: false,
    properties: {
        headerName: {
            type: "string",
            minLength: 1,
            maxLength: 200,
            description: "Column header name",
        },
        field: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            description: "Field identifier for data binding",
        },
        minWidth: {
            type: "number",
            minimum: 0,
            description: "Minimum column width in pixels",
        },
        maxWidth: {
            type: "number",
            minimum: 0,
            description: "Maximum column width in pixels",
        },
        headerClass: {
            type: "array",
            items: {
                type: "string",
                minLength: 1,
                maxLength: 100,
            },
            description: "Array of CSS classes for header styling",
        },
        config: exports.columnConfigSchema,
    },
};
exports.headerGroupComponentParamsSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        icon: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            description: "Icon identifier (region, kpi, etc)",
        },
        subtitle: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            description: "Subtitle text (e.g., date period)",
        },
        dateEndStorageKey: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            description: "Storage key for date end reference",
        },
    },
};
exports.columnDefSchema = {
    type: "object",
    required: ["headerName"],
    additionalProperties: false,
    properties: {
        headerName: {
            type: "string",
            minLength: 1,
            maxLength: 200,
            description: "Column group header name",
        },
        headerClass: {
            type: "array",
            items: {
                type: "string",
                minLength: 1,
                maxLength: 100,
            },
            description: "Array of CSS classes for header styling",
        },
        headerGroupComponentParams: exports.headerGroupComponentParamsSchema,
        children: {
            type: "array",
            items: exports.columnChildSchema,
            minItems: 1,
            description: "Array of child columns",
        },
    },
};
exports.chartConfigSchema = {
    type: "object",
    properties: {
        merge: {
            type: "number",
            description: "Merge configuration value",
        },
        chartData: {
            type: "array",
            items: { type: "number" },
            description: "Array of numeric values for chart",
        },
        chartLabel: {
            type: "array",
            items: { type: "string" },
            description: "Array of labels for chart data points",
        },
    },
};
exports.cellConfigSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        unitMeasure: {
            type: "string",
            maxLength: 10,
            description: "Unit of measure (%, pp, etc)",
        },
        textAlign: {
            type: "string",
            enum: enums_1.TEXT_ALIGNMENTS,
            description: "Text alignment",
        },
        mergeCol: {
            type: "boolean",
            description: "Indicates if column should be merged",
        },
        merge: {
            type: "number",
            minimum: 0,
            description: "Merge configuration value",
        },
        variationDirection: {
            type: "string",
            enum: enums_1.VARIATION_DIRECTIONS,
            description: "Variation direction indicator",
        },
        textWeight: {
            type: "string",
            maxLength: 10,
            description: "Text weight (B for bold, etc)",
        },
        backgroundColorCode: {
            type: "string",
            pattern: enums_1.HEX_COLOR_PATTERN,
            description: "Background color in hexadecimal format",
        },
        chartData: {
            type: "array",
            items: { type: "number" },
            description: "Chart data for cell",
        },
        chartLabel: {
            type: "array",
            items: {
                type: "string",
                maxLength: 100,
            },
            description: "Chart labels for cell",
        },
    },
};
exports.rowDataItemSchema = {
    type: "object",
    description: "Row data item with dynamic fields and corresponding config fields",
    patternProperties: {
        "^group_\\d+_\\d+$": {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Cell value (string or number)",
        },
        "^group_\\d+_\\d+_config$": exports.cellConfigSchema,
    },
};
exports.breakdownTableDataSchema = {
    type: "object",
    required: ["columnDefs", "rowData"],
    properties: {
        columnDefs: {
            type: "array",
            items: exports.columnDefSchema,
            minItems: 1,
            description: "Array of column definitions (ag-Grid format)",
        },
        rowData: {
            type: "array",
            items: exports.rowDataItemSchema,
            minItems: 1,
            description: "Array of row data with dynamic fields and configurations",
        },
    },
    description: "Complete BreakdownTable data structure with column definitions and row data",
};
//# sourceMappingURL=breakdownTable.schema.js.map