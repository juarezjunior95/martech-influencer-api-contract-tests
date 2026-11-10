"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBookExportDto = void 0;
const class_validator_1 = require("@nestjs/class-validator");
const swagger_1 = require("@nestjs/swagger");
class PowerBookExportDto {
}
exports.PowerBookExportDto = PowerBookExportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Array of category names to export.",
        example: ["All", "Megabrands"],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], PowerBookExportDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Period type for the response.",
        example: "QTD",
    }),
    (0, class_validator_1.IsIn)(["QTD", "YTD"]),
    __metadata("design:type", String)
], PowerBookExportDto.prototype, "period", void 0);
//# sourceMappingURL=power-book-export.dto.js.map