"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBigNumberArraySchema = exports.createBigNumberCardSchema = exports.bigNumberDataSchema = exports.bigNumberComparisonSchema = exports.bigNumberSecondaryInfoSchema = exports.bigNumberPeriodSchema = exports.bigNumberValueSchema = exports.bigNumberDemographicSchema = void 0;
var primitives_schema_1 = require("./primitives.schema");
Object.defineProperty(exports, "bigNumberDemographicSchema", { enumerable: true, get: function () { return primitives_schema_1.bigNumberDemographicSchema; } });
Object.defineProperty(exports, "bigNumberValueSchema", { enumerable: true, get: function () { return primitives_schema_1.bigNumberValueSchema; } });
Object.defineProperty(exports, "bigNumberPeriodSchema", { enumerable: true, get: function () { return primitives_schema_1.bigNumberPeriodSchema; } });
Object.defineProperty(exports, "bigNumberSecondaryInfoSchema", { enumerable: true, get: function () { return primitives_schema_1.bigNumberSecondaryInfoSchema; } });
Object.defineProperty(exports, "bigNumberComparisonSchema", { enumerable: true, get: function () { return primitives_schema_1.bigNumberComparisonSchema; } });
var bigNumberData_schema_1 = require("./bigNumberData.schema");
Object.defineProperty(exports, "bigNumberDataSchema", { enumerable: true, get: function () { return bigNumberData_schema_1.bigNumberDataSchema; } });
Object.defineProperty(exports, "createBigNumberCardSchema", { enumerable: true, get: function () { return bigNumberData_schema_1.createBigNumberCardSchema; } });
Object.defineProperty(exports, "createBigNumberArraySchema", { enumerable: true, get: function () { return bigNumberData_schema_1.createBigNumberArraySchema; } });
__exportStar(require("./legacy.schema"), exports);
__exportStar(require("./consumerBehavior.schema"), exports);
__exportStar(require("./innovation.schema"), exports);
__exportStar(require("./categoryHome.schema"), exports);
//# sourceMappingURL=index.js.map