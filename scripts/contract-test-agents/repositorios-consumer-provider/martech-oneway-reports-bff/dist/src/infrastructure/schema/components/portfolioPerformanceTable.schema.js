"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioPerformanceTableDataSchema = exports.portfolioTableSectionSchema = exports.portfolioTableRowSchema = exports.portfolioTableCellValueSchema = exports.brandItemSchema = exports.portfolioTableHeaderSchema = exports.portfolioTableHeaderChildSchema = void 0;
const enums_1 = require("../constants/enums");
exports.portfolioTableHeaderChildSchema = {
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
};
exports.portfolioTableHeaderSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
            description: "Header identifier (optional for parent headers)",
        },
        title: {
            type: "string",
            description: "Header title",
        },
        subtitle: {
            type: "string",
            description: "Header subtitle (e.g., date period like 'Oct'25')",
        },
        dateEndStorageKey: {
            type: "string",
            description: "Storage key for date end reference",
        },
        children: {
            type: "array",
            items: exports.portfolioTableHeaderChildSchema,
            description: "Nested column headers",
        },
    },
};
exports.brandItemSchema = {
    type: "object",
    required: ["name"],
    additionalProperties: false,
    properties: {
        src: {
            type: "string",
            format: "uri",
            description: "Brand logo image URL",
        },
        name: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            description: "Brand name",
        },
        variation: {
            type: "number",
            description: "Variation value",
        },
        variationMeasure: {
            type: "string",
            maxLength: 10,
            description: "Variation unit of measure (%, pp, etc)",
        },
        variationDirection: {
            type: "string",
            enum: enums_1.VARIATION_DIRECTIONS,
            description: "Variation direction indicator",
        },
        country: {
            type: "string",
            minLength: 2,
            maxLength: 3,
            description: "Country code (USA, BRA, MEX, etc)",
        },
    },
};
exports.portfolioTableCellValueSchema = {
    type: "object",
    required: ["value"],
    additionalProperties: false,
    properties: {
        value: {
            oneOf: [{ type: "string" }, { type: "number" }],
            description: "Cell value",
        },
        unitMeasure: {
            type: "string",
            maxLength: 10,
            description: "Unit of measure (%, pp, etc)",
        },
        variationDirection: {
            type: "string",
            pattern: enums_1.HEX_COLOR_PATTERN,
            description: "Hexadecimal color for variation direction",
        },
        marginBottom: {
            type: "boolean",
            description: "Apply margin bottom styling",
        },
        radiusRight: {
            type: "boolean",
            description: "Apply right border radius styling",
        },
        radiusTop: {
            type: "boolean",
            description: "Apply top border radius styling",
        },
        brands: {
            type: "array",
            items: exports.brandItemSchema,
            description: "Array of brand items (for Brands column)",
        },
    },
};
exports.portfolioTableRowSchema = {
    type: "array",
    items: {
        type: "object",
        description: "Row cells - keys match header IDs",
        patternProperties: {
            [enums_1.DYNAMIC_PROPERTY_PATTERN]: exports.portfolioTableCellValueSchema,
        },
        additionalProperties: true,
    },
    description: "Array of row data",
};
exports.portfolioTableSectionSchema = {
    type: "object",
    required: ["header", "rows"],
    additionalProperties: false,
    properties: {
        header: {
            type: "array",
            minItems: 1,
            items: exports.portfolioTableHeaderSchema,
            description: "Section headers",
        },
        rows: {
            type: "array",
            items: exports.portfolioTableRowSchema,
            description: "Section rows data",
        },
    },
    description: "Individual table section (Portfolio, Volume, etc)",
};
exports.portfolioPerformanceTableDataSchema = {
    type: "object",
    properties: {
        Portfolio: exports.portfolioTableSectionSchema,
        Volume: exports.portfolioTableSectionSchema,
        "Net Revenue": exports.portfolioTableSectionSchema,
        "S&M": exports.portfolioTableSectionSchema,
        Brands: exports.portfolioTableSectionSchema,
    },
    description: "Complete Portfolio Performance table data structure with multiple sections",
};
//# sourceMappingURL=portfolioPerformanceTable.schema.js.map