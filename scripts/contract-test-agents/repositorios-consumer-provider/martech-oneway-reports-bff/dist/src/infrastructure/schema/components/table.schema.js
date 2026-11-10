"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableDataSchema = exports.tableRowsSchema = exports.tableCellTypeSchema = exports.tableCellValueSchema = exports.variationSchema = exports.tableHeaderSchema = exports.tableHeaderItemSchema = void 0;
const enums_1 = require("../constants/enums");
exports.tableHeaderItemSchema = {
    type: "object",
    required: ["id", "title"],
    additionalProperties: false,
    properties: {
        id: {
            type: "string",
            minLength: 0,
            maxLength: 50,
            description: "Unique column ID (can be empty for label columns)",
        },
        title: {
            type: "string",
            minLength: 0,
            maxLength: 100,
            description: "Column title displayed in header",
        },
    },
};
exports.tableHeaderSchema = {
    type: "array",
    minItems: 1,
    items: exports.tableHeaderItemSchema,
    description: "Array of table headers (columns)",
};
exports.variationSchema = {
    type: "object",
    required: ["unitOfMeasure", "variationDirection", "value"],
    additionalProperties: false,
    properties: {
        unitOfMeasure: {
            type: "string",
            enum: enums_1.UNIT_OF_MEASURE,
            description: "Variation unit of measure",
        },
        variationDirection: {
            type: "string",
            pattern: enums_1.HEX_COLOR_PATTERN,
            description: "Hexadecimal color indicating direction (green=up, red=down)",
        },
        value: {
            type: "number",
            description: "Numeric variation value",
        },
    },
};
exports.tableCellValueSchema = {
    type: "object",
    required: ["value"],
    properties: {
        value: {
            oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
            description: "Cell value (can be string, number or boolean)",
        },
    },
};
exports.tableCellTypeSchema = {
    type: "object",
    required: ["value"],
    additionalProperties: false,
    properties: {
        value: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            description: "Cell type (e.g.: 'abi', 'competitor', etc)",
        },
    },
};
exports.tableRowsSchema = {
    type: "array",
    items: {
        type: "array",
        description: "Array of objects representing row cells",
        items: {
            type: "object",
            description: "Table cell - structure varies by column (id, type, variation, chartData, etc)",
        },
    },
    description: "Array of table rows",
};
exports.tableDataSchema = {
    type: "object",
    required: ["header", "rows"],
    properties: {
        header: exports.tableHeaderSchema,
        rows: exports.tableRowsSchema,
    },
    description: "Complete table data structure (TableDataType) - header defines columns, rows contains data",
};
//# sourceMappingURL=table.schema.js.map