"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.innovationBigNumbersSchema = exports.innovationBigNumbersArraySchema = exports.innovationBigNumberCardSchema = exports.bigNumberDataItemSchema = exports.innovationBigNumberDataItemSchema = void 0;
const enums_1 = require("../../constants/enums");
const bigNumberData_schema_1 = require("./bigNumberData.schema");
exports.innovationBigNumberDataItemSchema = bigNumberData_schema_1.bigNumberDataSchema;
exports.bigNumberDataItemSchema = bigNumberData_schema_1.bigNumberDataSchema;
exports.innovationBigNumberCardSchema = (0, bigNumberData_schema_1.createBigNumberCardSchema)({
    idEnum: enums_1.INNOVATION_CARD_IDS,
    requiredFields: ["id", "hasDeepDive", "data"],
    dataFieldName: "data",
    includeHasDeepDive: true,
    description: "Single card in the innovation big numbers output",
});
exports.innovationBigNumbersArraySchema = (0, bigNumberData_schema_1.createBigNumberArraySchema)(exports.innovationBigNumberCardSchema, {
    minItems: 1,
    description: "Array of innovation big number cards",
});
exports.innovationBigNumbersSchema = {
    oneOf: [exports.innovationBigNumbersArraySchema],
    description: "Innovation big numbers data - array of cards",
};
//# sourceMappingURL=innovation.schema.js.map