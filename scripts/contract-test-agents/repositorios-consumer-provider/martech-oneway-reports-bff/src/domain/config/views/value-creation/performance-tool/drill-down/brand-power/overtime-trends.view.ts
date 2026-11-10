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
        name: "page_filter",
      },
      {
        name: "timeframe",
      },
    ],
  },
  components: [
    {
      id: "overtime-trends",
      formatter:
        "value-creation/performance-tool/drill-down/non-finance/overtime-trends-charts",
      datasources: [
        {
          name: "value-creation_performance-tool_drill-down_non-finance_overtime-trends_by-granularity",
          filters: [
            {
              name: "kpi",
              defaultValue: "power",
            },
          ],
        },
        {
          name: "value-creation_performance-tool_drill-down_non-finance_overtime-trends_snapshot",
          filters: [
            {
              name: "kpi",
              defaultValue: "power",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
