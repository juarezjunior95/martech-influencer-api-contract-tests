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
      { name: "waterfall_filter" },
      { name: "zone" },
      { name: "portfolio" },
      { name: "segment" },
      { name: "brand" },
      { name: "page_filter" },
    ],
  },
  components: [
    {
      id: "waterfall",
      formatter: "mobile/value-creation/deep-dive/brand-power/waterfall",
      datasources: [
        {
          name: "value-creation_performance-tool_drill-down_non-finance_contribution_waterfall",
          title: "waterfall",
          filters: [
            { name: "kpi", defaultValue: "power" },
            { name: "max_ranked", defaultValue: "15" },
          ],
        },
      ],
    },
  ],
};

export default config;
