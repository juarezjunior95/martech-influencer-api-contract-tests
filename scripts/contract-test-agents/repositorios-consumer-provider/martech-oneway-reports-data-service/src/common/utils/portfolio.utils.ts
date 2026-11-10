export const KPI_TITLES = {
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
} as const;

export type KpiName = keyof typeof KPI_TITLES;

export const REVERSE_DIRECTION_KPIS = new Set<KpiName>([
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

// Helpers
export const isReverseDirection = (kpi: string): boolean =>
  REVERSE_DIRECTION_KPIS.has(kpi as KpiName);

export const getKpiTitle = (kpi: string): string =>
  KPI_TITLES[kpi as KpiName] ?? kpi;
