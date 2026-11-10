import { ViewConfig } from "@domain/entities/view.entity";

const config: ViewConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["default"],
  },
  filters: {
    default: [
      {
        name: "dt_end",
      },
      {
        name: "dt_ini",
      },
      {
        name: "growth_lever",
      },
      {
        name: "page_filter",
      },
      {
        name: "country",
      },
      {
        name: "viewtype",
      },
      {
        name: "zone",
      },
      {
        name: "portfolio",
      },
      {
        name: "segment",
      },
      {
        name: "brand",
      },
      {
        name: "sub_brand",
      },
      {
        name: "waterfall_filter",
      },
      {
        name: "period_type",
      },
    ],
  },
  components: [
    {
      id: "overtime-trends",
      formatter:
        "value-creation/performance-tool/drill-down/finance/net-revenue/overtime-trends-charts",
      datasources: [
        {
          name: "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-trends_by-granularity",
          filters: [
            {
              name: "kpi",
              defaultValue: "nr",
            },
          ],
        },
        {
          name: "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-trends_snapshot",
          filters: [
            {
              name: "kpi",
              defaultValue: "nr",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
