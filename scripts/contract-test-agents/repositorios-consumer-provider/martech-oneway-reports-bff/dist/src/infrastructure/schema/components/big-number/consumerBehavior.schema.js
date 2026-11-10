"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumerBehaviorBigNumberDataItemSchema = exports.consumerBehaviorBigNumberDataSchema = exports.consumerBehaviorBigNumbersSchema = exports.consumerBehaviorBigNumbersArraySchema = exports.consumerBehaviorCardSchema = void 0;
const bigNumberData_schema_1 = require("./bigNumberData.schema");
Object.defineProperty(exports, "consumerBehaviorBigNumberDataSchema", { enumerable: true, get: function () { return bigNumberData_schema_1.bigNumberDataSchema; } });
Object.defineProperty(exports, "consumerBehaviorBigNumberDataItemSchema", { enumerable: true, get: function () { return bigNumberData_schema_1.bigNumberDataSchema; } });
exports.consumerBehaviorCardSchema = (0, bigNumberData_schema_1.createBigNumberCardSchema)({
    requiredFields: ["title", "period", "bigNumberData"],
    dataFieldName: "bigNumberData",
    minItems: 1,
    description: "Individual Consumer Behavior card (e.g., 'Beer Participation')",
});
exports.consumerBehaviorBigNumbersArraySchema = (0, bigNumberData_schema_1.createBigNumberArraySchema)(exports.consumerBehaviorCardSchema, {
    minItems: 1,
    maxItems: 2,
    description: "Array of Consumer Behavior cards (Beer and ABI Participation)",
});
exports.consumerBehaviorBigNumbersSchema = {
    oneOf: [exports.consumerBehaviorBigNumbersArraySchema],
    description: "Consumer Behavior Big Numbers main schema",
};
//# sourceMappingURL=consumerBehavior.schema.js.map