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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ClearCacheUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCacheUseCase = void 0;
const common_1 = require("@nestjs/common");
let ClearCacheUseCase = ClearCacheUseCase_1 = class ClearCacheUseCase {
    constructor(viewCacheRepository, presetCacheRepository, pageCacheRepository) {
        this.viewCacheRepository = viewCacheRepository;
        this.presetCacheRepository = presetCacheRepository;
        this.pageCacheRepository = pageCacheRepository;
        this.logger = new common_1.Logger(ClearCacheUseCase_1.name);
    }
    async execute(tags) {
        const deletedCount = await this.viewCacheRepository.invalidateByTags(tags);
        const pageDeletedCount = await this.pageCacheRepository.invalidateByTags(tags);
        const presetDeletedCount = await this.presetCacheRepository.invalidateByTags(tags);
        const totalDeletedCount = deletedCount + presetDeletedCount + pageDeletedCount;
        this.logger.log(`Cache cleared for tags [${tags.join(", ")}]: ${totalDeletedCount} keys deleted`);
        return { deletedCount: totalDeletedCount };
    }
};
exports.ClearCacheUseCase = ClearCacheUseCase;
exports.ClearCacheUseCase = ClearCacheUseCase = ClearCacheUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IViewCacheRepository")),
    __param(1, (0, common_1.Inject)("IPresetCacheRepository")),
    __param(2, (0, common_1.Inject)("IPageCacheRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], ClearCacheUseCase);
//# sourceMappingURL=clear-cache.usecase.js.map