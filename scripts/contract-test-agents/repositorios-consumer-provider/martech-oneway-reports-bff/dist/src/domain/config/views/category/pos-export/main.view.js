"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["pos-export"],
    },
    compressed: true,
    filters: {
        default: [
            { name: "country" },
            { name: "time_frame" },
            { name: "dt_ini" },
            { name: "dt_end" },
        ],
    },
    components: [
        {
            id: "slide-01-cover-locale",
            formatter: "category/pos-export/components/slide01-cover-locale",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-02-insights-list",
            formatter: "category/pos-export/components/slide02-insights-list",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-03-alcohol-bar-line",
            formatter: "category/pos-export/components/slide03-alcohol-bar-line",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-04-alcohol-bar-full",
            formatter: "category/pos-export/components/slide04-alcohol-bar-full",
            datasources: [
                {
                    name: "category_pos-export_components_slide04-alcohol-bar-full",
                    filters: [{ name: "country" }, { name: "dt_end" }],
                },
            ],
        },
        {
            id: "slide-05-alcohol-table",
            formatter: "category/pos-export/components/slide05-alcohol-table",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-06-beer-bb-bar-line",
            formatter: "category/pos-export/components/slide06-beer-bb-bar-line",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-07-beer-bb-table",
            formatter: "category/pos-export/components/slide07-beer-bb-table",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-08-abi-bar-line",
            formatter: "category/pos-export/components/slide08-abi-bar-line",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-09-abi-table",
            formatter: "category/pos-export/components/slide09-abi-table",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-10-manufacturer-bar",
            formatter: "category/pos-export/components/slide10-manufacturer-bar",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-11-portfolio-cards",
            formatter: "category/pos-export/components/slide11-portfolio-cards",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-12-growth-levers-cards",
            formatter: "category/pos-export/components/slide12-growth-levers-cards",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-13-beer-bb-brands-bar",
            formatter: "category/pos-export/components/slide13-beer-bb-brands-bar",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
        {
            id: "slide-14-beer-brands-bar",
            formatter: "category/pos-export/components/slide14-beer-brands-bar",
            datasources: [
                { name: "example", filters: [{ name: "test", defaultValue: "test" }] },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=main.view.js.map