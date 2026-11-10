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
      { name: "period" },
      { name: "period_type" },
      { name: "timeframe" },
      { name: "kpi" },
      { name: "zone" },
      { name: "portfolio" },
      { name: "segment" },
      { name: "brand" },
      { name: "page_filter" },
    ],
  },
  components: [
    {
      id: "big-numbers",
      formatter: "mobile/value-creation/deep-dive/brand-power/big-numbers",
      datasources: [
        {
          name: "value-creation_performance-tool_drill-down_non-finance_overtime-performance",
          title: "bigNumbers",
          filters: [{ name: "kpi", defaultValue: "power" }],
        },
      ],
    },
  ],
};

export default config;
