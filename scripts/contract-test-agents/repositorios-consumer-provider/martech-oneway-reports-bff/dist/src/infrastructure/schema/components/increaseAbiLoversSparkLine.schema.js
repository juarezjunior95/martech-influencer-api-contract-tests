"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseAbiLoversSparkLineSchema = exports.increaseAbiLoversBigNumberDataItemSchema = void 0;
var big_number_1 = require("./big-number");
Object.defineProperty(exports, "increaseAbiLoversBigNumberDataItemSchema", { enumerable: true, get: function () { return big_number_1.bigNumberDataSchema; } });
const big_number_2 = require("./big-number");
exports.increaseAbiLoversSparkLineSchema = {
    type: "object",
    required: ["chartTitle", "chartPeriod", "bigNumberData", "chartLineData"],
    additionalProperties: false,
    properties: {
        chartTitle: {
            type: "string",
            minLength: 1,
            description: "Chart title (e.g., 'P7D Participation')",
        },
        chartPeriod: {
            type: "string",
            description: 'Formatted period string (e.g., "Q3\'25 - R12M")',
        },
        bigNumberData: {
            type: "array",
            items: big_number_2.bigNumberDataSchema,
            minItems: 1,
            maxItems: 1,
            description: "Array with a single BigNumber data item",
        },
        chartLineData: {
            type: "array",
            items: { type: "number" },
            minItems: 1,
            description: "Sparkline numeric data points",
        },
    },
    description: "Increase Abi Lovers BigNumber SparkLine data",
};
//# sourceMappingURL=increaseAbiLoversSparkLine.schema.js.map