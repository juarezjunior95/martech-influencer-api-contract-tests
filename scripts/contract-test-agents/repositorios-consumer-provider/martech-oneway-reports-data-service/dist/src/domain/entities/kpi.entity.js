"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpiEntityNegativeZero = exports.KpiEntity = void 0;
const brand_image_utils_1 = require("../../common/utils/images/brand-image.utils");
const country_image_utils_1 = require("../../common/utils/images/country-image.utils");
const direction_utils_1 = require("../../common/utils/direction.utils");
const month_utils_1 = require("../../common/utils/month.utils");
const period_utils_1 = require("../../common/utils/period.utils");
class KpiEntity {
    constructor(init, options) {
        const variationPositiveZero = options?.variationPositiveZero ?? true;
        if (init) {
            Object.entries(init).forEach(([key, value]) => {
                const normalizedKey = key.toLowerCase();
                this[normalizedKey] = value;
            });
        }
        this.vs_ly_label_suffix = (0, period_utils_1.areDatesInSameQuarter)(this.dt_end, this.dt_ini)
            ? "MTD"
            : "YTD";
        this.comp_direction =
            this.value !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.value))
                : undefined;
        this.variationDirectionAc =
            this.ac !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.ac), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionVsLy =
            this.ac_vs_ly !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.ac_vs_ly), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionPerHl =
            this.per_hl !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.per_hl), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionPerHlVsLy =
            this.per_hl_vs_ly !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.per_hl_vs_ly), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionVsLe =
            this.le_vs_ly !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.le_vs_ly), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionGrowthCont =
            this.growth_contrib !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.growth_contrib), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionTooltip =
            this.tooltip !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.tooltip), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionContribution =
            this.contribution !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.contribution), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionOgVsLy =
            this.og_vs_ly !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.og_vs_ly))
                : undefined;
        this.variationDirectionVsBu =
            this.ac_vs_bu !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.ac_vs_bu))
                : undefined;
        this.variationDirectionAverageLine =
            this.average_line !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.average_line))
                : undefined;
        this.variationDirectionVilcVsLy =
            this.vilc_vs_ly !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.vilc_vs_ly), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionNrVsLy =
            this.nr_vs_ly !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.nr_vs_ly), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionSmVsLy =
            this.sm_vs_ly !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.sm_vs_ly), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionVolVsLy =
            this.vol_vs_ly !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.vol_vs_ly), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.variationDirectionMacoVsLy =
            this.maco_vs_ly !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.maco_vs_ly), {
                    positiveZero: variationPositiveZero,
                })
                : undefined;
        this.contributionMeasure =
            this.contribution_measure_unit?.[this.kpi_name] ?? undefined;
        this.variationDirectionDelta =
            this.delta !== undefined
                ? (0, direction_utils_1.formatDirection)(Number(this.delta))
                : undefined;
        this.refreshMonthLabel = (0, month_utils_1.formatMonth)(this.dt_end, {
            includeYear: true,
            yearFormat: "short",
        });
        this.lyMonthLabel = (0, month_utils_1.formatMonth)(this.dt_end, {
            includeYear: true,
            yearFormat: "short",
            usePreviousYear: true,
        });
        if (this.raw_brand !== undefined) {
            this.brand = {
                imageSquare: (0, brand_image_utils_1.getBrandImage)(this.raw_brand, {
                    format: "square",
                }),
                imageTable: (0, brand_image_utils_1.getBrandImage)(this.raw_brand, {
                    format: "table",
                }),
            };
        }
        if (this.image_key !== undefined ||
            this.country_iso_code_3 !== undefined ||
            this.raw_geography !== undefined) {
            const countryCode = this.image_key ||
                this.country_iso_code_3 ||
                this.raw_geography;
            this.country = {
                imageIcon: (0, country_image_utils_1.getCountryFlag)(countryCode, {
                    format: "icon",
                }),
                imageWaving: (0, country_image_utils_1.getCountryFlag)(countryCode, {
                    format: "waving",
                }),
            };
        }
    }
}
exports.KpiEntity = KpiEntity;
class KpiEntityNegativeZero extends KpiEntity {
    constructor(init) {
        super(init, { variationPositiveZero: false });
    }
}
exports.KpiEntityNegativeZero = KpiEntityNegativeZero;
//# sourceMappingURL=kpi.entity.js.map