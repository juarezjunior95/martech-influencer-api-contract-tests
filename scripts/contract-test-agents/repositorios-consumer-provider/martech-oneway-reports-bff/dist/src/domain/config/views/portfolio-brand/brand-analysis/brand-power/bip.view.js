"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["default"],
    },
    filters: {
        default: [
            {
                name: "country",
            },
            {
                name: "zone",
            },
            {
                name: "viewtype",
            },
            {
                name: "brand",
            },
            {
                name: "sub_brand",
            },
            {
                name: "sub_brand_comp",
            },
            {
                name: "dt_end",
            },
        ],
    },
    components: [
        {
            id: "bip",
            formatter: "portfolio-brand/brand-analysis/brand-power/bip",
            datasources: [
                {
                    name: "portfolio-brand_brand-analysis_brand-power_bip_st",
                    filters: [
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "sub_brand_comp",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=bip.view.js.map