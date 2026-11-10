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
var ProcessCountriesExportUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessCountriesExportUseCase = void 0;
const common_1 = require("@nestjs/common");
const power_book_filters_1 = require("./helpers/power-book-filters");
let ProcessCountriesExportUseCase = ProcessCountriesExportUseCase_1 = class ProcessCountriesExportUseCase {
    constructor(processViewUseCase) {
        this.processViewUseCase = processViewUseCase;
        this.logger = new common_1.Logger(ProcessCountriesExportUseCase_1.name);
    }
    async execute(countries, filterSets, periods) {
        this.logger.log(`Processing countries export: ${countries.length} countries, periods: ${periods.join(", ")}`);
        const baseFilters = (0, power_book_filters_1.withFilter)(filterSets, "viewtype", "country");
        const result = {};
        for (const period of periods) {
            const periodFilters = (0, power_book_filters_1.withFilter)(baseFilters, "period_type", period);
            const entries = [];
            for (const country of countries) {
                entries.push([
                    country,
                    await this.processCountry(country, periodFilters),
                ]);
            }
            result[period] = Object.fromEntries(entries);
        }
        return result;
    }
    async processCountry(country, baseFilterSets) {
        const start = Date.now();
        const filterSets = (0, power_book_filters_1.withFilter)(baseFilterSets, "country", country);
        const [overview, overviewMegabrands, abiBrandBreakdown, competitorBrandBreakdown, summaryPower,] = await Promise.all([
            this.processViewUseCase.execute(ProcessCountriesExportUseCase_1.VIEWS.OVERVIEW, (0, power_book_filters_1.withFilter)(filterSets, "page_filter", "All")),
            this.processViewUseCase.execute(ProcessCountriesExportUseCase_1.VIEWS.OVERVIEW, (0, power_book_filters_1.withFilter)(filterSets, "page_filter", "Megabrands")),
            this.processViewUseCase.execute(ProcessCountriesExportUseCase_1.VIEWS.BRAND_BREAKDOWN, (0, power_book_filters_1.withFilter)(filterSets, "page_filter", "TT ABI Portfolio")),
            this.processViewUseCase.execute(ProcessCountriesExportUseCase_1.VIEWS.BRAND_BREAKDOWN, (0, power_book_filters_1.withFilter)(filterSets, "page_filter", "TT ABI Segment")),
            this.processViewUseCase.execute(ProcessCountriesExportUseCase_1.VIEWS.SUMMARY_POWER, (0, power_book_filters_1.withFilter)(filterSets, "page_filter", "All")),
        ]);
        this.logger.log(`[COUNTRY:${country}] Complete (${Date.now() - start}ms)`);
        return {
            overview,
            overviewMegabrands,
            abiBrandBreakdown,
            competitorBrandBreakdown,
            summaryPower,
        };
    }
};
exports.ProcessCountriesExportUseCase = ProcessCountriesExportUseCase;
ProcessCountriesExportUseCase.VIEWS = {
    OVERVIEW: "portfolio-brand_brand-power-book_overview_power-book-overview",
    BRAND_BREAKDOWN: "portfolio-brand_brand-power-book-export_country_brand-breakdown",
    SUMMARY_POWER: "portfolio-brand_brand-power-book_overview_summary_summary-power",
};
exports.ProcessCountriesExportUseCase = ProcessCountriesExportUseCase = ProcessCountriesExportUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ICachedProcessViewUseCase")),
    __metadata("design:paramtypes", [Object])
], ProcessCountriesExportUseCase);
//# sourceMappingURL=process-countries-export.usecase.js.map