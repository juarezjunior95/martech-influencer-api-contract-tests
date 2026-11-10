import { ViewConfig } from "@domain/entities/view.entity";

const config: ViewConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["default"],
  },
  filters: {
    default: [
      { name: "country" },
      { name: "dt_end" },
      { name: "dt_ini" },
      { name: "viewtype" },
      { name: "growth_lever" },
      { name: "period" },
      { name: "period_type" },
      { name: "timeframe" },
      { name: "kpi" },
      { name: "zone" },
      { name: "portfolio" },
      { name: "segment" },
      { name: "brand" },
      { name: "sub_brand" },
      { name: "page_filter" },
    ],
  },
  components: [
    {
      id: "line-chart",
      formatter: "mobile/value-creation/deep-dive/shared/line-chart",
      datasources: [
        {
          name: "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-trends_by-granularity",
          title: "trend",
          filters: [{ name: "kpi", defaultValue: "market_share" }],
        },
        {
          name: "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-trends_snapshot",
          title: "snapshot",
          filters: [{ name: "kpi", defaultValue: "market_share" }],
        },
      ],
    },
  ],
};

export default config;
