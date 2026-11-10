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
var ProcessPowerBookExportUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPowerBookExportUseCase = void 0;
const common_1 = require("@nestjs/common");
const power_book_filters_1 = require("./helpers/power-book-filters");
let ProcessPowerBookExportUseCase = ProcessPowerBookExportUseCase_1 = class ProcessPowerBookExportUseCase {
    constructor(processViewUseCase) {
        this.processViewUseCase = processViewUseCase;
        this.logger = new common_1.Logger(ProcessPowerBookExportUseCase_1.name);
    }
    async execute(categories, filterSets, period) {
        this.logger.log(`Processing export (categories: ${categories.join(", ")}, period: ${period})`);
        const entries = [];
        for (const category of categories) {
            entries.push([
                category,
                await this.processCategory(category, filterSets, period),
            ]);
        }
        return Object.fromEntries(entries);
    }
    async processCategory(category, baseFilterSets, period) {
        const start = Date.now();
        const filterSets = (0, power_book_filters_1.withFilter)(baseFilterSets, "page_filter", category);
        const periodFilters = (0, power_book_filters_1.withFilter)(filterSets, "period_type", period);
        const [zonePerformance, bigNumbers, maturityPerformance, zonePerformanceDetails,] = await Promise.all([
            this.processViewUseCase.execute(ProcessPowerBookExportUseCase_1.VIEWS.ZONE_PERFORMANCE, periodFilters),
            this.processViewUseCase.execute(ProcessPowerBookExportUseCase_1.VIEWS.BIG_NUMBERS, periodFilters),
            this.processViewUseCase.execute(ProcessPowerBookExportUseCase_1.VIEWS.MATURITY_PERFORMANCE, periodFilters),
            this.processViewUseCase.execute(ProcessPowerBookExportUseCase_1.VIEWS.ZONE_PERFORMANCE_DETAILS, periodFilters),
        ]);
        const result = {
            zonePerformance,
            bigNumbers,
            maturityPerformance,
            zonePerformanceDetails,
        };
        const hasEvolutionData = ProcessPowerBookExportUseCase_1.EVOLUTION_CATEGORIES.includes(category);
        if (hasEvolutionData) {
            const scopeFilters = category !== "All"
                ? (0, power_book_filters_1.withFilter)(periodFilters, "scope", category)
                : periodFilters;
            const [topCountryContribution, trendPowerEvolution] = await Promise.all([
                this.processViewUseCase.execute(ProcessPowerBookExportUseCase_1.VIEWS.TOP_COUNTRY_CONTRIBUTION, scopeFilters),
                this.processViewUseCase.execute(ProcessPowerBookExportUseCase_1.VIEWS.TREND_POWER_EVOLUTION, scopeFilters),
            ]);
            result.topCountryContribution = topCountryContribution;
            result.trendPowerEvolution = trendPowerEvolution;
        }
        this.logger.log(`[CAT:${category}] Complete (${Date.now() - start}ms)`);
        return result;
    }
};
exports.ProcessPowerBookExportUseCase = ProcessPowerBookExportUseCase;
ProcessPowerBookExportUseCase.VIEWS = {
    ZONE_PERFORMANCE: "portfolio-brand_brand-power-book-export_global_zone-performance",
    BIG_NUMBERS: "portfolio-brand_brand-power-book-export_global_big-numbers",
    ZONE_PERFORMANCE_DETAILS: "portfolio-brand_brand-power-book-export_global_zone-performance-details",
    TOP_COUNTRY_CONTRIBUTION: "portfolio-brand_brand-power-book-export_global_top-country-contribution",
    TREND_POWER_EVOLUTION: "portfolio-brand_brand-power-book-export_global_trend-power-evolution",
    MATURITY_PERFORMANCE: "portfolio-brand_brand-power-book-export_global_maturity-performance",
};
ProcessPowerBookExportUseCase.EVOLUTION_CATEGORIES = ["All", "Megabrands"];
exports.ProcessPowerBookExportUseCase = ProcessPowerBookExportUseCase = ProcessPowerBookExportUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ICachedProcessViewUseCase")),
    __metadata("design:paramtypes", [Object])
], ProcessPowerBookExportUseCase);
//# sourceMappingURL=process-power-book-export.usecase.js.map