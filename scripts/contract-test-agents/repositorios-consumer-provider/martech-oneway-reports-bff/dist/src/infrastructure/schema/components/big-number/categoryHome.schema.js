"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryHomeSparkLineBigNumberDataItemSchema = exports.categoryHomeSparkLineBigNumberDataSchema = exports.categoryHomeSparkLineSchema = exports.categoryHomeSparkLineArraySchema = exports.categoryHomeSparkLineCardSchema = void 0;
const bigNumberData_schema_1 = require("./bigNumberData.schema");
Object.defineProperty(exports, "categoryHomeSparkLineBigNumberDataSchema", { enumerable: true, get: function () { return bigNumberData_schema_1.bigNumberDataSchema; } });
Object.defineProperty(exports, "categoryHomeSparkLineBigNumberDataItemSchema", { enumerable: true, get: function () { return bigNumberData_schema_1.bigNumberDataSchema; } });
exports.categoryHomeSparkLineCardSchema = (0, bigNumberData_schema_1.createBigNumberCardSchema)({
    requiredFields: [
        "chartTitle",
        "chartPeriod",
        "bigNumberData",
        "chartLineData",
    ],
    dataFieldName: "bigNumberData",
    minItems: 1,
    maxItems: 1,
    additionalProperties: {
        chartTitle: {
            type: "string",
            minLength: 1,
            description: "Chart title (e.g., 'Beer Category Participation')",
        },
        chartPeriod: {
            type: "string",
            description: 'Chart period label (e.g., "Q3\'25 - R12M", "Nov\'25 YTD")',
        },
        chartLineData: {
            type: "array",
            items: { type: "number" },
            description: "Array of numeric values for sparkline chart",
        },
    },
    description: "Category Home SparkLine Card (BigNumber + Sparkline) for Grow/Lead the Category",
});
exports.categoryHomeSparkLineArraySchema = (0, bigNumberData_schema_1.createBigNumberArraySchema)(exports.categoryHomeSparkLineCardSchema, {
    minItems: 1,
    maxItems: 2,
    description: "Array of Category Home SparkLine Cards (Grow the Category and Lead the Category)",
});
exports.categoryHomeSparkLineSchema = {
    oneOf: [exports.categoryHomeSparkLineArraySchema],
    description: "Category Home SparkLine main schema",
};
//# sourceMappingURL=categoryHome.schema.js.map