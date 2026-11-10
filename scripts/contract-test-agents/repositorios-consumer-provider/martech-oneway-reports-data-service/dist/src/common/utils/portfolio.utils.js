"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKpiTitle = exports.isReverseDirection = exports.REVERSE_DIRECTION_KPIS = exports.KPI_TITLES = void 0;
exports.KPI_TITLES = {
    volume: "Total Volume",
    gross: "Gross Turnover",
    excise_taxes: "Excise duty $ eco taxes",
    discounts: "Discounts",
    nr: "NET REVENUE",
    vic: "VIC",
    vlc: "VLC",
    maco: "MACO",
    mkt_c: "Marketing Costs",
    sales_c: "Sales Costs",
    cores: "CORES",
    sm: "S&M",
    vilc: "VILC",
    volume_growth_contr: "Growth Contribution",
    market_share: "Market Share",
    power: "Brand Power",
    p4w: "Beer Participation",
    nr_per_hl: "NR/hl",
    vic_per_hl: "VIC/hl",
    vlc_per_hl: "VLC/hl",
    maco_per_hl: "MACO/hl",
    cores_per_hl: "CORES/hl",
    vilc_per_hl: "VILC/hl",
    maco_margin: "MACO Margin",
    sm_of_nr: "S&M as % of NR",
    cores_margin: "CORES Margin",
    sm_of_maco: "S&M as % of MACO",
};
exports.REVERSE_DIRECTION_KPIS = new Set([
    "excise_taxes",
    "discounts",
    "vic",
    "vlc",
    "mkt_c",
    "sales_c",
    "sm",
    "vilc",
    "vic_per_hl",
    "vlc_per_hl",
    "vilc_per_hl",
    "sm_of_nr",
    "sm_of_maco",
]);
const isReverseDirection = (kpi) => exports.REVERSE_DIRECTION_KPIS.has(kpi);
exports.isReverseDirection = isReverseDirection;
const getKpiTitle = (kpi) => exports.KPI_TITLES[kpi] ?? kpi;
exports.getKpiTitle = getKpiTitle;
//# sourceMappingURL=portfolio.utils.js.map